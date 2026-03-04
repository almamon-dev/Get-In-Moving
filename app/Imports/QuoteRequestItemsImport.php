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

    public function model(array $row)
    {
        Log::info('Processing CSV row. Available keys: '.implode(', ', array_keys($row)));
        // Mode A: Creating new QuoteRequest for every row (Bulk Import)
        if (! $this->quoteRequestId && $this->userId) {
            $this->quoteRequestId = $this->createNewParentFromRow($row);
        } else {
            // Mode B: Adding to an existing QuoteRequest (Form + File)
            $this->updateParentHeader($row);
        }

        $itemType = $row['item_type'] ?? $row['item'] ?? null;
        $quantity = $row['quantity'] ?? $row['qty'] ?? null;

        if (empty($itemType) || empty($quantity)) {
            Log::warning('Skipping row due to missing item_type or quantity: ', $row);

            return null;
        }
        try {
            $item = new QuoteRequestItem([
                'quote_request_id' => $this->quoteRequestId,
                'item_type' => $row['item_type'] ?? $row['item'] ?? null,
                'quantity' => $row['quantity'] ?? $row['qty'] ?? 0,
                'length' => $row['length_cm'] ?? $row['length'] ?? null,
                'width' => $row['width_cm'] ?? $row['width'] ?? null,
                'height' => $row['height_cm'] ?? $row['height'] ?? null,
                'weight' => $row['weight_kg'] ?? $row['weight'] ?? null,
            ]);

            // If we are in Bulk Mode, we reset the ID for the next row to create its own parent
            if ($this->userId && ! empty($this->attachmentPath)) {
                $this->quoteRequestId = null;
            }

            Log::info('Successfully created model for QuoteRequestItem.');

            return $item;
        } catch (\Exception $e) {
            Log::error('Error creating QuoteRequestItem for row: '.$e->getMessage(), ['row' => $row]);

            return null;
        }
    }

    private function createNewParentFromRow(array $row)
    {
        $data = [
            'user_id' => $this->userId,
            'service_type' => $row['service_type'] ?? null,
            'pickup_address' => $row['pickup_address'] ?? null,
            'delivery_address' => $row['delivery_address'] ?? null,
            'additional_notes' => $row['additional_notes'] ?? $row['notes'] ?? null,
            'attachment_path' => $this->attachmentPath,
            'status' => 'active',
        ];

        if (! empty($row['pickup_date'])) {
            $data['pickup_date'] = $this->parseDate($row['pickup_date']);
        }
        if (! empty($row['pickup_time_from'])) {
            $data['pickup_time_from'] = $this->parseTime($row['pickup_time_from']);
        }
        if (! empty($row['pickup_time_till'])) {
            $data['pickup_time_till'] = $this->parseTime($row['pickup_time_till']);
        }

        $parent = QuoteRequest::create($data);
        Log::info('Bulk Mode: Created new QuoteRequest parent ID: '.$parent->id);

        return $parent->id;
    }

    private function updateParentHeader(array $row)
    {
        $parent = QuoteRequest::find($this->quoteRequestId);
        if (! $parent) {
            Log::error('QuoteRequest parent not found during import update.', ['id' => $this->quoteRequestId]);

            return;
        }

        $fields = [
            'service_type', 'pickup_address', 'delivery_address', 'additional_notes',
        ];

        $updateData = [];
        foreach ($fields as $field) {
            // Only update if parent field is empty AND row has data
            if (empty($parent->{$field}) && ! empty($row[$field])) {
                $updateData[$field] = $row[$field];
                $parent->{$field} = $row[$field]; // Update local object to avoid multiple updates for same field
            }
        }

        // Handle Date and Time parsing if not already set
        if (empty($parent->pickup_date) && ! empty($row['pickup_date'])) {
            $parsedDate = $this->parseDate($row['pickup_date']);
            if ($parsedDate) {
                $updateData['pickup_date'] = $parsedDate;
                $parent->pickup_date = $parsedDate;
            }
        }

        if (empty($parent->pickup_time_from) && ! empty($row['pickup_time_from'])) {
            $parsedTime = $this->parseTime($row['pickup_time_from']);
            if ($parsedTime) {
                $updateData['pickup_time_from'] = $parsedTime;
                $parent->pickup_time_from = $parsedTime;
            }
        }

        if (empty($parent->pickup_time_till) && ! empty($row['pickup_time_till'])) {
            $parsedTime = $this->parseTime($row['pickup_time_till']);
            if ($parsedTime) {
                $updateData['pickup_time_till'] = $parsedTime;
                $parent->pickup_time_till = $parsedTime;
            }
        }

        $additionalNotes = $row['additional_notes'] ?? $row['notes'] ?? null;
        if (empty($parent->additional_notes) && ! empty($additionalNotes)) {
            $updateData['additional_notes'] = $additionalNotes;
            $parent->additional_notes = $additionalNotes;
        }

        if (! empty($updateData)) {
            Log::info('Updating QuoteRequest header with: ', $updateData);
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
