<?php

use App\Exports\QuoteItemsTemplateExport;
use Maatwebsite\Excel\Facades\Excel;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Define data manually here to bypass the Export class's empty collection
class DummyExport extends QuoteItemsTemplateExport {
    public function collection() {
        return collect([
            [
                'service_type' => 'Euro pallets',
                'pickup_address' => 'House #12, Road #5, Dhanmondi, Dhaka',
                'delivery_address' => 'Agrabad, Chittagong',
                'pickup_date' => '2026-03-25',
                'delivery_date' => '2026-03-27',
                'pickup_time_from' => '09:00',
                'pickup_time_till' => '12:00',
                'delivery_time_from' => '10:00',
                'delivery_time_till' => '15:00',
                'item_type' => 'Euro pallets',
                'quantity' => '1',
                'length' => '120',
                'width' => '80',
                'height' => '100',
                'weight' => '6.66',
                'additional_notes' => 'Example 1: Single item request.',
            ],
            [
                'service_type' => 'Standard Box',
                'pickup_address' => 'Gulshan, Dhaka',
                'delivery_address' => 'Khulna',
                'pickup_date' => '2026-04-01',
                'delivery_date' => '2026-04-03',
                'pickup_time_from' => '08:00',
                'pickup_time_till' => '11:00',
                'delivery_time_from' => '10:00',
                'delivery_time_till' => '14:00',
                'item_type' => 'Box',
                'quantity' => '3',
                'length' => '50, 60, 70',
                'width' => '50',
                'height' => '50',
                'weight' => '10, 12, 15',
                'additional_notes' => 'Example 2: Multiple items using commas.',
            ]
        ]);
    }
}

Excel::store(new DummyExport, 'quote_items_template.xlsx', 'local');
$source = storage_path('app/private/quote_items_template.xlsx');
$dest = __DIR__ . '/quote_items_template.xlsx';

if (file_exists($source)) {
    @copy($source, $dest);
    echo "\nSUCCESS: Created XLSX at: $dest\n";
} else {
    echo "\nERROR: Source file not found at: $source\n";
}


