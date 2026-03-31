<?php

namespace App\Imports;

use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class QuoteRequestItemsImport implements SkipsEmptyRows, ToModel, WithHeadingRow, WithValidation
{
    protected $quoteRequestId;

    protected $userId;

    protected $attachmentPath;

    public function __construct($quoteRequestId = null, $userId = null, $attachmentPath = null)
    {
        $this->quoteRequestId = $quoteRequestId;
        $this->userId = $userId;
        $this->attachmentPath = $attachmentPath;
    }

    public function rules(): array
    {
        return [
            'item_type' => 'required|string',
            'quantity' => 'required|numeric|min:1',
        ];
    }

    protected $lastGroupKey = null;

    public function model(array $row)
    {
        Log::info('Processing CSV row. Available keys: '.implode(', ', array_keys($row)));

        $currentGroupKey = md5(
            ($row['pickup_address'] ?? '').
            ($row['delivery_address'] ?? '').
            ($row['pickup_date'] ?? '').
            ($row['delivery_date'] ?? '')
        );

        if ($currentGroupKey !== $this->lastGroupKey) {
            // New request detected or first row
            $this->quoteRequestId = null;
            $this->lastGroupKey = $currentGroupKey;
        }

        if (! $this->quoteRequestId && $this->userId) {
            $this->quoteRequestId = $this->createNewParentFromRow($row);
        } elseif ($this->quoteRequestId) {
            $this->updateParentHeader($row);
        }

        $itemTypeString = (string) ($row['item_type'] ?? $row['item'] ?? '');
        $quantityString = (string) ($row['quantity'] ?? $row['qty'] ?? '');
        $lengthString = (string) ($row['length_cm'] ?? $row['length'] ?? '');
        $widthString = (string) ($row['width_cm'] ?? $row['width'] ?? '');
        $heightString = (string) ($row['height_cm'] ?? $row['height'] ?? '');
        $weightString = (string) ($row['weight_kg'] ?? $row['weight'] ?? '');

        if (empty($itemTypeString) || empty($quantityString)) {
            Log::warning('Skipping row due to missing item_type or quantity: ', $row);

            return null;
        }

        // Split comma-separated values
        $itemTypes = array_map('trim', explode(',', $itemTypeString));
        $quantities = array_map('trim', explode(',', $quantityString));
        $lengths = array_map('trim', explode(',', $lengthString));
        $widths = array_map('trim', explode(',', $widthString));
        $heights = array_map('trim', explode(',', $heightString));
        $weights = array_map('trim', explode(',', $weightString));

        // Determine the maximum number of items in this row
        $maxItems = max(count($itemTypes), count($quantities), count($lengths), count($widths), count($heights), count($weights));

        $items = [];
        for ($i = 0; $i < $maxItems; $i++) {
            try {
                // If an array is shorter than max, we reuse the last value or first if only one exists
                $item = new QuoteRequestItem([
                    'quote_request_id' => $this->quoteRequestId,
                    'item_type' => $itemTypes[$i] ?? end($itemTypes),
                    'quantity' => $quantities[$i] ?? end($quantities),
                    'length' => $lengths[$i] ?? (! empty($lengths) ? end($lengths) : null),
                    'width' => $widths[$i] ?? (! empty($widths) ? end($widths) : null),
                    'height' => $heights[$i] ?? (! empty($heights) ? end($heights) : null),
                    'weight' => $weights[$i] ?? (! empty($weights) ? end($weights) : null),
                ]);

                if (! empty($item->item_type) && ! empty($item->quantity)) {
                    $items[] = $item;
                }
            } catch (\Exception $e) {
                Log::error('Error creating sub-item in split logic: '.$e->getMessage());
            }
        }

        Log::info('Created '.count($items).' items from comma-separated split.');

        return $items;
    }

    private function createNewParentFromRow(array $row)
    {
        $data = [
            'user_id' => $this->userId,
            'pallet_type' => $row['pallet_type'] ?? $row['service_type'] ?? null,
            'pickup_address' => $row['pickup_address'] ?? null,
            'delivery_address' => $row['delivery_address'] ?? null,
            'additional_notes' => $row['additional_notes'] ?? $row['additional_note'] ?? $row['notes'] ?? $row['note'] ?? null,
            'attachment_path' => $this->attachmentPath,
            'status' => 'active',
        ];

        if (! empty($row['pickup_date'])) {
            $data['pickup_date'] = $this->parseDate($row['pickup_date']);
        }
        if (! empty($row['delivery_date'])) {
            $data['delivery_date'] = $this->parseDate($row['delivery_date']);
        }
        if (! empty($row['pickup_time_from'])) {
            $data['pickup_time_from'] = $this->parseTime($row['pickup_time_from']);
        }
        if (! empty($row['pickup_time_till'])) {
            $data['pickup_time_till'] = $this->parseTime($row['pickup_time_till']);
        }
        if (! empty($row['delivery_time_from'])) {
            $data['delivery_time_from'] = $this->parseTime($row['delivery_time_from']);
        }
        if (! empty($row['delivery_time_till'])) {
            $data['delivery_time_till'] = $this->parseTime($row['delivery_time_till']);
        }

        $parent = QuoteRequest::create($data);
        Log::info('Bulk Mode: Created new QuoteRequest parent ID: '.$parent->id);

        return $parent->id;
    }

    private function updateParentHeader(array $row)
    {
        $parent = QuoteRequest::find($this->quoteRequestId);
        if (!$parent instanceof QuoteRequest) {
            return;
        }

        $hasChanged = false;

        // Group fields to check
        $mappings = [
            'pickup_address' => $row['pickup_address'] ?? null,
            'delivery_address' => $row['delivery_address'] ?? null,
            'additional_notes' => $row['additional_notes'] ?? $row['additional_note'] ?? $row['notes'] ?? $row['note'] ?? null,
            'pallet_type' => $row['pallet_type'] ?? $row['service_type'] ?? null,
        ];

        foreach ($mappings as $field => $val) {
            if (empty($parent->{$field}) && !empty($val)) {
                $parent->{$field} = $val;
                $hasChanged = true;
            }
        }

        // Date fields
        foreach (['pickup_date', 'delivery_date'] as $field) {
            if (empty($parent->{$field}) && !empty($row[$field])) {
                $parsed = $this->parseDate($row[$field]);
                if ($parsed) {
                    $parent->{$field} = $parsed;
                    $hasChanged = true;
                }
            }
        }

        // Time fields
        foreach (['pickup_time_from', 'pickup_time_till', 'delivery_time_from', 'delivery_time_till'] as $field) {
            if (empty($parent->{$field}) && !empty($row[$field])) {
                $parsed = $this->parseTime($row[$field]);
                if ($parsed) {
                    $parent->{$field} = $parsed;
                    $hasChanged = true;
                }
            }
        }

        if ($hasChanged) {
            Log::info('Syncing parent header fields for QuoteRequest ID: ' . $parent->id);
            $parent->save();
        }
    }

    private function parseDate($val)
    {
        try {
            if ($val instanceof \DateTimeInterface) {
                $date = Carbon::instance($val);
            } elseif (is_numeric($val)) {
                $date = Carbon::instance(Date::excelToDateTimeObject($val));
            } else {
                $cleanVal = trim($val);
                $formats = ['m/d/Y', 'm-d-Y', 'm/d/y', 'm-d-y', 'Y-m-d', 'd-m-Y', 'd/m/Y'];
                $date = null;

                foreach ($formats as $format) {
                    try {
                        $date = Carbon::createFromFormat($format, $cleanVal);
                        break;
                    } catch (\Exception $e) {
                    }
                }

                if (! $date) {
                    $date = Carbon::parse($cleanVal);
                }
            }

            if ($date && $date->year < 100) {
                $date->year += 2000;
            }

            return $date ? $date->format('Y-m-d') : null;
        } catch (\Exception $e) {
            Log::warning('Failed to parse date: '.$val.'. Error: '.$e->getMessage());

            return null;
        }
    }

    private function parseTime($val)
    {
        try {
            if ($val instanceof \DateTimeInterface) {
                return $val->format('H:i:s');
            }

            if (is_numeric($val)) {
                return Carbon::instance(Date::excelToDateTimeObject($val))->format('H:i:s');
            }

            return Carbon::parse($val)->format('H:i:s');
        } catch (\Exception $e) {
            Log::warning('Failed to parse time: '.$val.'. Error: '.$e->getMessage());

            return null;
        }
    }

    public function customValidationMessages()
    {
        return [
            'item_type.required' => 'Item type is missing.',
            'quantity.required' => 'Quantity is required.',
            'quantity.numeric' => 'Quantity must be a number.',
        ];
    }
}
