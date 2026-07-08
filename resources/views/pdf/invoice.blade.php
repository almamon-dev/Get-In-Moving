<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 0px;
        }
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
            font-size: 13px;
            color: #333;
            margin: 0;
            padding: 0;
            position: relative;
        }
        .top-bar {
            background-color: #1a2533;
            height: 20px;
            width: 100%;
        }
        .top-left-triangle {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 40px 40px 0 0;
            border-color: #38b2ac transparent transparent transparent;
        }
        .bottom-bar-wrapper {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 25px;
        }
        .bottom-bar {
            background-color: #1a2533;
            height: 12px;
            width: 100%;
            position: absolute;
            bottom: 0;
        }
        .bottom-right-triangle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 0 40px 40px;
            border-color: transparent transparent #38b2ac transparent;
        }
        .container {
            padding: 20px 40px;
        }
        .invoice-title {
            font-size: 36px;
            font-weight: 800;
            margin: 0;
            color: #000;
            letter-spacing: 1.5px;
        }
        .logo-box {
            display: inline-block;
            background-color: #fbbf24;
            color: white;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 22px;
            font-weight: bold;
            margin-right: 10px;
            vertical-align: middle;
        }
        .logo-text {
            display: inline-block;
            font-size: 16px;
            font-weight: 900;
            color: #38b2ac;
            text-align: left;
            vertical-align: middle;
            line-height: 1.1;
        }
        .logo-text span {
            display: block;
            color: #1a2533;
        }
        .section-heading {
            font-size: 16px;
            font-weight: 800;
            margin: 0 0 8px 0;
            color: #1a2533;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .items-table {
            margin-top: 5px;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #fbbf24;
            color: #000;
            padding: 8px 10px;
            text-align: left;
            font-weight: 800;
            font-size: 11px;
        }
        .items-table td {
            padding: 8px 10px;
            color: #333;
            font-size: 12px;
        }
        .items-table tbody tr:nth-child(even) {
            background-color: #f3f4f6;
        }
        .items-table tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }
        .totals-table {
            width: 100%;
        }
        .totals-table td {
            padding: 4px 0;
        }
        .totals-table td:last-child {
            text-align: right;
            padding-right: 15px;
        }
        .totals-table .grand-total td {
            font-weight: 800;
            font-size: 13px;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            padding: 8px 0;
        }
        .totals-table .grand-total td:last-child {
            padding-right: 15px;
        }
        .terms-list {
            padding-left: 15px;
            margin-top: 0;
            color: #333;
            font-size: 11px;
            line-height: 1.3;
        }
        .terms-list li {
            margin-bottom: 3px;
        }
        .payment-bar {
            background-color: #1a2533;
            color: #ffffff;
            padding: 8px 40px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 20px;
        }
        .signature-line {
            border-top: 1px solid #333;
            width: 150px;
            display: inline-block;
            padding-top: 4px;
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="top-bar"></div>
    <div class="top-left-triangle"></div>

    <div class="container">
        <!-- Header -->
        <table style="margin-bottom: 20px;">
            <tr>
                <td style="width: 50%;">
                    <h1 class="invoice-title">INVOICE</h1>
                </td>
                <td style="width: 50%; text-align: right;">
                    @php
                        $appName = env('APP_NAME', 'GetIt Moving');
                        // Split by space, or if no space, just show the whole thing with no second part
                        $nameParts = explode(' ', $appName, 2);
                        $firstName = $nameParts[0] ?? 'GetIt';
                        $secondName = $nameParts[1] ?? 'Moving';
                        $initial = strtoupper(substr($firstName, 0, 1));
                    @endphp
                    <div class="logo-box">{{ $initial }}</div>
                    <div class="logo-text">
                        {{ $firstName }}<br>
                        <span>{{ $secondName }}</span>
                    </div>
                </td>
            </tr>
        </table>
        
        <!-- Bill To -->
        <table style="margin-bottom: 25px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <h3 class="section-heading">Bill To:</h3>
                    <div style="line-height: 1.4;">
                        <div><strong>Client Name:</strong> {{ $invoice->order->customer->name ?? 'N/A' }}</div>
                        <div><strong>Company Name:</strong> {{ $invoice->order->customer->company_name ?? 'N/A' }}</div>
                        <div><strong>Billing Address:</strong> {{ $invoice->order->customer->address ?? 'N/A' }}</div>
                        <div><strong>Phone:</strong> {{ $invoice->order->customer->phone_number ?? 'N/A' }}</div>
                        <div><strong>Email:</strong> {{ $invoice->order->customer->email ?? 'N/A' }}</div>
                    </div>
                </td>
                <td style="width: 50%; vertical-align: bottom;">
                    <table style="width: 100%; font-weight: bold;">
                        <tr>
                            <td style="text-align: left; width: 40%; padding-bottom: 3px;">Invoice Number:</td>
                            <td style="text-align: left; padding-bottom: 3px; font-weight: normal;">{{ $invoice->invoice_number }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: left; width: 40%;">Invoice Date:</td>
                            <td style="text-align: left; font-weight: normal;">{{ $invoice->created_at->format('F d, Y') }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Service Details -->
        <h3 class="section-heading">Service Details:</h3>
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 45%;">Description of Service</th>
                    <th style="width: 15%;">Quantity</th>
                    <th style="width: 15%;">Rate (€)</th>
                    <th style="width: 20%;">Total (€)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->order->items as $index => $item)
                <tr>
                    <td style="text-align: center; font-weight: bold;">{{ $index + 1 }}</td>
                    <td>{{ $item->item_type }}</td>
                    <td>{{ $item->quantity }} project</td>
                    <td>€{{ number_format($item->weight ?? 0, 2) }}</td>
                    <td>€{{ number_format(($item->quantity * ($item->weight ?? 0)), 2) }}</td>
                </tr>
                @endforeach
                @if($invoice->order->items->isEmpty())
                <tr>
                    <td style="text-align: center; font-weight: bold;">1</td>
                    <td>{{ $invoice->order->pallet_type ?? 'Road Freight Service' }}</td>
                    <td>1 project</td>
                    <td>€{{ number_format($invoice->supplier_amount, 2) }}</td>
                    <td>€{{ number_format($invoice->supplier_amount, 2) }}</td>
                </tr>
                @endif
            </tbody>
        </table>

        <!-- Totals & Terms -->
        <table style="margin-bottom: 10px;">
            <tr>
                <td style="width: 60%; vertical-align: top; padding-right: 15px;">
                    <h3 class="section-heading">Terms and Conditions:</h3>
                    <ul class="terms-list">
                        <li>Payment is due upon receipt of this invoice.</li>
                        <li>Late payments may incur additional charges.</li>
                        <li>Please make checks payable to GetItMoving Logistics.</li>
                    </ul>
                </td>
                <td style="width: 40%; vertical-align: top;">
                    <table class="totals-table">
                        <tr>
                            <td>Subtotal</td>
                            <td>€{{ number_format($invoice->supplier_amount, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Platform Fee (5%)</td>
                            <td>€{{ number_format($invoice->platform_fee, 2) }}</td>
                        </tr>
                        <tr class="grand-total">
                            <td>Total Amount Due</td>
                            <td>€{{ number_format($invoice->total_amount, 2) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- Payment Information Bar -->
    <div class="payment-bar">
        Payment Information:
    </div>

    <div class="container" style="padding-top: 15px; padding-bottom: 30px;">
        <table>
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <div style="line-height: 1.4;">
                        <div><strong>Payment Method:</strong> {{ $invoice->payments()->latest()->first()?->payment_method === 'pay_later' ? 'Pay Later' : ($invoice->payments()->latest()->first() ? 'Credit Card/Stripe' : 'Bank Transfer') }}</div>
                        <div><strong>Due Date:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('F d, Y') }}</div>
                        <div><strong>Payment Status:</strong> {{ ucfirst($invoice->status) }}</div>
                    </div>
                    
                    <h3 class="section-heading" style="margin-top: 15px;">Questions</h3>
                    <div style="line-height: 1.4;">
                        <div><strong>Email US:</strong> support@getitmoving.com</div>
                        <div><strong>Call US:</strong> (123) 456-7890</div>
                    </div>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: bottom;">
                    <div style="margin-bottom: 25px;">Date : {{ $invoice->created_at->format('F d, Y') }}</div>
                    <div class="signature-line">
                        GetItMoving Admin
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="bottom-bar-wrapper">
        <div class="bottom-bar"></div>
        <div class="bottom-right-triangle"></div>
    </div>
</body>
</html>
