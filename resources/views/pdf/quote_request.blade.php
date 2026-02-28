<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quote Request Details</title>
    <style>
        body { font-family: sans-serif; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #777; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Quote Request #{{ $quoteRequest->id }}</h1>
        <p>Generated on {{ now()->format('j M Y, h:i A') }}</p>
    </div>

    <div class="section">
        <div class="section-title">General Information</div>
        <p><strong>Service Type:</strong> {{ $quoteRequest->service_type }}</p>
        <p><strong>Customer Name:</strong> {{ $quoteRequest->user->name }}</p>
        <p><strong>Status:</strong> {{ ucfirst($quoteRequest->status) }}</p>
    </div>

    <div class="section">
        <div class="section-title">Pickup & Delivery Details</div>
        <p><strong>Pickup Address:</strong> {{ $quoteRequest->pickup_address }}</p>
        <p><strong>Delivery Address:</strong> {{ $quoteRequest->delivery_address }}</p>
        <p><strong>Pickup Date:</strong> {{ (empty($quoteRequest->pickup_date) || str_contains($quoteRequest->pickup_date, '_')) ? $quoteRequest->pickup_date : \Carbon\Carbon::parse($quoteRequest->pickup_date)->format('j M Y') }}</p>
        <p><strong>Time Window:</strong> {{ $quoteRequest->pickup_time_from }} - {{ $quoteRequest->pickup_time_till }}</p>
    </div>

    @if($quoteRequest->additional_notes)
    <div class="section">
        <div class="section-title">Additional Notes</div>
        <p>{{ $quoteRequest->additional_notes }}</p>
    </div>
    @endif

    <div class="section">
        <div class="section-title">Items List</div>
        <table>
            <thead>
                <tr>
                    <th>Item Type</th>
                    <th>Quantity</th>
                    <th>Dimensions (LxWxH) cm</th>
                    <th>Weight (kg)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($quoteRequest->items as $item)
                <tr>
                    <td>{{ $item->item_type }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ $item->length ?? 'N/A' }} x {{ $item->width ?? 'N/A' }} x {{ $item->height ?? 'N/A' }}</td>
                    <td>{{ $item->weight ?? 'N/A' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>This is a system generated document from Get It Moving.</p>
    </div>
</body>
</html>
