<?php
include 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$q = \App\Models\QuoteRequest::latest()->first();
if($q) {
    echo "ID: " . $q->id . "\n";
    echo "Pickup Date: [" . $q->pickup_date . "]\n";
    echo "Created At: [" . $q->created_at . "]\n";
} else {
    echo "No QuoteRequest found\n";
}
