<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiExtractionService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
    }

    /**
     * Extract data from a PDF file using OpenAI.
     */
    public function extractFromPdf($filePath, $originalFilename = null)
    {
        try {
            // 1. Upload file to OpenAI first
            $fileId = $this->uploadToOpenAi($filePath, $originalFilename);

            // 2. Process the file with GPT-4o
            return $this->parseFileWithAi($fileId);
        } catch (\Exception $e) {
            Log::error('PDF AI Extraction Error: '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * Upload the file to OpenAI's storage.
     */
    protected function uploadToOpenAi($filePath, $originalFilename = null)
    {
        $filename = $originalFilename ?: basename($filePath);

        // OpenAI requires valid extensions like .pdf. If it's a .tmp, force .pdf
        if (str_ends_with(strtolower($filename), '.tmp') || ! str_contains($filename, '.')) {
            $filename = pathinfo($filename, PATHINFO_FILENAME).'.pdf';
        }

        if (!file_exists($filePath)) {
            Log::error("PDF file not found for AI extraction: {$filePath}");
            throw new \Exception("File not found: " . basename($filePath));
        }

        $response = Http::withToken($this->apiKey)
            ->attach('file', file_get_contents($filePath), $filename)
            ->post('https://api.openai.com/v1/files', [
                'purpose' => 'assistants',
            ]);

        if ($response->failed()) {
            throw new \Exception('Failed to upload file to OpenAI: '.$response->body());
        }

        return $response->json('id');
    }

    /**
     * Use OpenAI to parse the uploaded file ID.
     */
    protected function parseFileWithAi($fileId)
    {
        if (empty($this->apiKey)) {
            Log::error('OpenAI API Key is missing.');
            throw new \Exception('OpenAI API Key not configured.');
        }

        $systemPrompt = "You are a professional logistics parser. Your goal is to extract 100% of the shipping items from the provided document.
        IF THE DOCUMENT HAS 100 ITEMS, EXTRACT ALL 100. DO NOT MERGE ITEMS. DO NOT SKIP ANY ROWS.
        Even if the items look similar, extract each one as a separate object in the JSON array.
        
        Return ONLY a valid JSON array of objects with these keys:
        - pallet_type, pickup_address, delivery_address, pickup_date, pickup_time_from, pickup_time_till, item_type, quantity, length_cm, width_cm, height_cm, weight_kg, additional_notes.
        
        CRITICAL: If an item is missing dimensions or weight, use null.
        CRITICAL: Your response must contain ONLY the JSON array. Start with [ and end with ]. No markdown, no intro, no outro.";

        return $this->processViaAssistant($fileId, $systemPrompt);
    }

    protected function processViaAssistant($fileId, $systemPrompt)
    {
        $assistantId = null;
        $threadId = null;

        try {
            // 1. Create Assistant
            $assistant = Http::withToken($this->apiKey)
                ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                ->post('https://api.openai.com/v1/assistants', [
                    'model' => 'gpt-4o',
                    'instructions' => $systemPrompt,
                    'tools' => [['type' => 'file_search']],
                ])->json();

            $assistantId = $assistant['id'] ?? null;
            if (!$assistantId) {
                Log::error('Failed to create OpenAI Assistant: ', (array) $assistant);
                throw new \Exception('Failed to create OpenAI Assistant.');
            }

            // 2. Create Thread with File
            $thread = Http::withToken($this->apiKey)
                ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                ->post('https://api.openai.com/v1/threads', [
                    'messages' => [[
                        'role' => 'user',
                        'content' => 'Extract data from this file.',
                        'attachments' => [['file_id' => $fileId, 'tools' => [['type' => 'file_search']]]],
                    ]],
                ])->json();

            $threadId = $thread['id'] ?? null;
            if (!$threadId) {
                Log::error('Failed to create OpenAI Thread: ', (array) $thread);
                throw new \Exception('Failed to create OpenAI Thread.');
            }

            // 3. Create Run
            $run = Http::withToken($this->apiKey)
                ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                ->post("https://api.openai.com/v1/threads/{$threadId}/runs", [
                    'assistant_id' => $assistantId,
                ])->json();

            $runId = $run['id'] ?? null;
            if (!$runId) {
                Log::error('Failed to start OpenAI Run: ', (array) $run);
                throw new \Exception('Failed to start OpenAI Run.');
            }

            // 4. Poll for completion
            $status = 'queued';
            $maxAttempts = 30; // 60 seconds max
            $attempts = 0;

            while (in_array($status, ['queued', 'in_progress', 'cancelling']) && $attempts < $maxAttempts) {
                sleep(2);
                $runResponse = Http::withToken($this->apiKey)
                    ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                    ->get("https://api.openai.com/v1/threads/{$threadId}/runs/{$runId}");
                
                $run = $runResponse->json();
                
                if ($runResponse->failed()) {
                    Log::error("OpenAI Polling Error ({$runResponse->status()}): " . $runResponse->body());
                    $status = 'failed';
                    break;
                }

                $status = $run['status'] ?? 'failed';
                Log::info("OpenAI Run {$runId} status: {$status} (Attempt {$attempts})");
                $attempts++;
            }

            if ($status !== 'completed') {
                $errorMessage = "AI extraction failed (Run status: {$status}).";
                if (isset($run['last_error'])) {
                    $errorDetail = $run['last_error']['message'] ?? json_encode($run['last_error']);
                    $errorMessage .= " Error: {$errorDetail}";
                }
                Log::error($errorMessage, (array) $run);
                throw new \Exception($errorMessage);
            }

            // 5. Get Messages
            $messages = Http::withToken($this->apiKey)
                ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                ->get("https://api.openai.com/v1/threads/{$threadId}/messages")
                ->json();

            $content = '';
            if (isset($messages['data']) && is_array($messages['data'])) {
                foreach ($messages['data'] as $message) {
                    if (($message['role'] ?? '') === 'assistant') {
                        foreach ($message['content'] ?? [] as $contentBlock) {
                            if (isset($contentBlock['text']['value'])) {
                                $content = $contentBlock['text']['value'];
                                break 2;
                            }
                        }
                    }
                }
            }

            if (empty($content)) {
                Log::error('No text content found in OpenAI assistant messages.', (array) $messages);
                throw new \Exception('AI assistant failed to provide a response.');
            }

            Log::info('OpenAI Raw Content: ' . $content);

            // Robust JSON extraction
            $jsonStart = strpos($content, '[');
            $jsonEnd = strrpos($content, ']');

            if ($jsonStart !== false && $jsonEnd !== false) {
                $jsonStr = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);
                $data = json_decode($jsonStr, true);
            } else {
                Log::error('Failed to find JSON array in OpenAI response content.');
                $data = null;
            }

            return $data;

        } finally {
            // Cleanup: Delete Assistant (optional, maybe keep it?)
            // For now, let's at least delete the assistant to avoid cluttering OpenAI account
            if ($assistantId) {
                Http::withToken($this->apiKey)
                    ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                    ->delete("https://api.openai.com/v1/assistants/{$assistantId}");
            }
            // Thread deletion is also good practice
            if ($threadId) {
                 Http::withToken($this->apiKey)
                    ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                    ->delete("https://api.openai.com/v1/threads/{$threadId}");
            }
        }
    }
}
