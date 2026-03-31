<?php

use App\Exports\QuoteItemsTemplateExport;
use Maatwebsite\Excel\Facades\Excel;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Store it in the local storage disk
Excel::store(new QuoteItemsTemplateExport, 'quote_items_template.xlsx');

echo "\nSUCCESS: File generated at: " . storage_path('app/private/quote_items_template.xlsx') . "\n";
echo "Also attempting to copy to root...\n";
@copy(storage_path('app/private/quote_items_template.xlsx'), __DIR__ . '/quote_items_template.xlsx');
echo "\nCheck root: " . __DIR__ . "/quote_items_template.xlsx\n";
