<?php

namespace App\Imports;

use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class QuoteRequestItemsImport implements SkipsEmptyRows, ToModel, WithHeadingRow, WithValidation
{
    protected $quoteRequestId;

    private $processedFirstRow = false;

    public function __construct($quoteRequestId)
    {
        $this->quoteRequestId = $quoteRequestId;
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
        // Update Parent (Header) Data from the first valid row only
        if (! $this->processedFirstRow) {
            $this->updateParentHeader($row);
            $this->processedFirstRow = true;
        }

        // Skip rows without essential item data
        if (empty($row['item_type']) || empty($row['quantity'])) {
            return null;
        }

        return new QuoteRequestItem([
            'quote_request_id' => $this->quoteRequestId,
            'item_type' => $row['item_type'],
            'quantity' => $row['quantity'],
            'length' => $row['length'] ?? null,
            'width' => $row['width'] ?? null,
            'height' => $row['height'] ?? null,
            'weight' => $row['weight'] ?? null,
        ]);
    }

    private function updateParentHeader(array $row)
    {
        $parent = QuoteRequest::find($this->quoteRequestId);
        if (! $parent) {
            return;
        }

        $fields = [
            'service_type', 'pickup_address', 'delivery_address', 'additional_notes',
        ];

        $updateData = [];
        foreach ($fields as $field) {
            if (! empty($row[$field])) {
                $updateData[$field] = $row[$field];
            }
        }

        // Handle Date and Time parsing
        if (! empty($row['pickup_date'])) {
            $updateData['pickup_date'] = $this->parseDate($row['pickup_date']);
        }
        if (! empty($row['pickup_time_from'])) {
            $updateData['pickup_time_from'] = $this->parseTime($row['pickup_time_from']);
        }
        if (! empty($row['pickup_time_till'])) {
            $updateData['pickup_time_till'] = $this->parseTime($row['pickup_time_till']);
        }

        if (! empty($updateData)) {
            $parent->update($updateData);
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
            return null;
        }
    }

    private function parseTime($val)
    {
        try {
            if ($val instanceof \DateTimeInterface) {
                return $val->format('H:i:s');
            }

            return Carbon::parse($val)->format('H:i:s');
        } catch (\Exception $e) {
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
