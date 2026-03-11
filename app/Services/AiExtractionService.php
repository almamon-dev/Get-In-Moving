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
        - service_type, pickup_address, delivery_address, pickup_date, pickup_time_from, pickup_time_till, item_type, quantity, length_cm, width_cm, height_cm, weight_kg, additional_notes.
        
        CRITICAL: If an item is missing dimensions or weight, use null.
        CRITICAL: Your response must contain ONLY the JSON array. Start with [ and end with ]. No markdown, no intro, no outro.";

        $response = Http::withToken($this->apiKey)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => [
                        ['type' => 'text', 'text' => 'Please extract shipping details from this document.'],
                        ['type' => 'file_search', 'file_id' => $fileId],
                    ]],
                ],
                'temperature' => 0,
            ]);

        return $this->processViaAssistant($fileId, $systemPrompt);
    }

    protected function processViaAssistant($fileId, $systemPrompt)
    {
        // 1. Create Assistant
        $assistant = Http::withToken($this->apiKey)
            ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
            ->post('https://api.openai.com/v1/assistants', [
                'model' => 'gpt-4o',
                'instructions' => $systemPrompt,
                'tools' => [['type' => 'file_search']],
            ])->json();

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

        // 3. Create Run
        $run = Http::withToken($this->apiKey)
            ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
            ->post("https://api.openai.com/v1/threads/{$thread['id']}/runs", [
                'assistant_id' => $assistant['id'],
            ])->json();

        // 4. Poll for completion
        $status = 'queued';
        while ($status === 'queued' || $status === 'in_progress') {
            sleep(2);
            $run = Http::withToken($this->apiKey)
                ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
                ->get("https://api.openai.com/v1/threads/{$thread['id']}/runs/{$run['id']}")
                ->json();
            $status = $run['status'];
        }

        // 5. Get Messages
        $messages = Http::withToken($this->apiKey)
            ->withHeaders(['OpenAI-Beta' => 'assistants=v2'])
            ->get("https://api.openai.com/v1/threads/{$thread['id']}/messages")
            ->json();

        $content = $messages['data'][0]['content'][0]['text']['value'];
        $data = json_decode(preg_replace('/^```json\s*|```$/', '', trim($content)), true);

        return $data;
    }
}
