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
            'Service Type',
            'Pickup Address',
            'Delivery Address',
            'Pickup Date',
            'Pickup Time From',
            'Pickup Time Till',
            'Item Type',
            'Quantity',
            'Length (cm)',
            'Width (cm)',
            'Height (cm)',
            'Weight (kg)',
            'Additional Notes',
        ];
    }
}
