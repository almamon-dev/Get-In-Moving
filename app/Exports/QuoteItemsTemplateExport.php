<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class QuoteItemsTemplateExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return collect([]);
    }

    public function headings(): array
    {
        return [
            'service_type',
            'pickup_address',
            'delivery_address',
            'pickup_date',
            'pickup_time_from',
            'pickup_time_till',
            'item_type',
            'quantity',
            'length',
            'width',
            'height',
            'weight',
            'additional_notes',
        ];
    }
}
