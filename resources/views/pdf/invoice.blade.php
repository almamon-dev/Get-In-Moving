<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 0px;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: #000000;
            background: #ffffff;
            padding: 0;
            margin: 0;
        }

        .container {
            padding: 30px 35px 80px 35px;
        }

        /* ─── HEADER TABLE ─────────────────────── */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .header-table td {
            vertical-align: top;
        }

        /* Logo styling matching image */
        .logo-title {
            font-size: 16px;
            font-weight: 900;
            color: #bc0000;
            letter-spacing: -0.3px;
            font-family: Arial, sans-serif;
            line-height: 1.1;
            margin-bottom: 4px;
        }
        .logo-badge {
            background-color: #000000;
            color: #ffffff;
            font-size: 9.5px;
            font-weight: bold;
            padding: 3px 8px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 4px;
            text-align: center;
        }
        .logo-subtext {
            font-size: 8.5px;
            color: #444444;
            margin-top: 4px;
            font-weight: bold;
        }

        /* Middle contact info matching image */
        .company-title {
            font-size: 13px;
            font-weight: 900;
            color: #000000;
            margin-bottom: 4px;
        }
        .company-info {
            font-size: 9.5px;
            color: #111111;
            line-height: 1.5;
        }
        .company-info span {
            display: block;
        }

        /* Right meta box matching image */
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000000;
        }
        .meta-table tr td {
            border: 1px solid #000000;
            padding: 5px 10px;
            font-size: 10px;
        }
        .meta-table tr td:first-child {
            background-color: #e5e7eb;
            font-weight: bold;
            color: #000000;
            width: 45%;
            text-align: center;
        }
        .meta-table tr td:last-child {
            font-weight: bold;
            text-align: center;
            color: #000000;
        }
        .meta-table tr.po-row td:last-child {
            color: #bc0000;
        }

        /* ─── CUSTOMER & SUPPLIER TABLE ─────────── */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000000;
            margin-bottom: 12px;
        }
        .info-table th {
            background-color: #e5e7eb;
            border: 1px solid #000000;
            border-bottom: 2px solid #000000;
            padding: 6px;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
            width: 50%;
        }
        .info-table td {
            border: 1px solid #000000;
            padding: 8px 12px;
            vertical-align: top;
            width: 50%;
            font-size: 10px;
            line-height: 1.7;
        }
        .info-row {
            display: block;
            margin-bottom: 2px;
        }
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 95px;
            color: #000000;
        }
        .info-val {
            color: #111111;
            font-weight: bold;
        }

        /* ─── METHOD / ROUTE / STATUS TABLE ─────── */
        .status-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000000;
            margin-bottom: 12px;
        }
        .status-table th {
            background-color: #e5e7eb;
            border: 1px solid #000000;
            border-bottom: 2px solid #000000;
            padding: 6px;
            font-size: 10.5px;
            font-weight: bold;
            text-align: center;
        }
        .status-table td {
            border: 1px solid #000000;
            padding: 8px;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
            color: #000000;
        }

        /* ─── ITEMS TABLE ───────────────────────── */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000000;
            margin-bottom: 0px;
        }
        .items-table th {
            background-color: #e5e7eb;
            border: 1px solid #000000;
            border-bottom: 2px solid #000000;
            padding: 6px 10px;
            font-size: 10.5px;
            font-weight: bold;
            text-align: left;
        }
        .items-table th.center { text-align: center; }
        .items-table th.right { text-align: right; }

        .items-table td {
            border: 1px solid #000000;
            padding: 8px 10px;
            font-size: 10.5px;
            font-weight: bold;
            color: #000000;
        }
        .items-table td.center { text-align: center; }
        .items-table td.right { text-align: right; }

        /* ─── TOTALS SECTION ────────────────────── */
        .totals-container {
            width: 100%;
            margin-top: 0px;
        }
        .totals-table {
            width: 320px;
            float: right;
            border-collapse: collapse;
        }
        .totals-table tr.sub-row td {
            padding: 6px 10px;
            font-size: 11px;
            font-weight: bold;
            border-bottom: 1px dashed #000000;
            border-left: 2px solid #000000;
            border-right: 2px solid #000000;
        }
        .totals-table tr.sub-row td:last-child {
            text-align: right;
        }

        /* Grand Total Box matching image */
        .grand-total-table {
            width: 320px;
            float: right;
            border-collapse: collapse;
            border: 2px solid #000000;
            margin-top: -1px;
        }
        .grand-total-table td {
            padding: 10px;
            font-weight: 900;
        }
        .grand-total-label {
            background-color: #e5e7eb;
            border-right: 2px solid #000000;
            font-size: 14px;
            width: 35%;
            color: #000000;
        }
        .grand-total-val {
            font-size: 18px;
            text-align: right;
            color: #000000;
        }

        .clear {
            clear: both;
        }

        /* ─── FOOTER BAR ────────────────────────── */
        .footer-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #bc0000;
            color: #ffffff;
            text-align: center;
            padding: 7px 10px;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

    <div class="container">

        <!-- Header Table -->
        <table class="header-table">
            <tr>
                <!-- Left: Logo & Tagline -->
                <td style="width: 32%;">
                    @php
                        $settingsMap = \App\Models\Setting::pluck('value', 'key');
                        $companyName = $settingsMap['company_name'] ?? config('app.name', 'GET IT MOVING');
                        $companyEmail = $settingsMap['company_email'] ?? 'support@getitmoving.com';
                        $companyPhone = $settingsMap['company_phone'] ?? '800-790-4469';
                        $companyAddress = $settingsMap['address'] ?? 'Watline Freight Ave, Logistics Hub';
                        $companyWebsite = $settingsMap['website'] ?? 'www.getitmoving.com';

                        $rawLogoPath = $settingsMap['site_logo'] ?? null;
                        $pdfImagePath = ($rawLogoPath && file_exists(public_path($rawLogoPath))) 
                            ? public_path($rawLogoPath) 
                            : (function_exists('get_site_logo') ? get_site_logo() : null);

                        $quote = $invoice->order?->quote;
                        $extraSum = $quote?->extraCharges?->sum('amount') ?? 0;
                        $baseFreightPrice = $quote?->base_amount ?? max(0, $invoice->supplier_amount - $extraSum);
                    @endphp
                    @if($pdfImagePath)
                        <img src="{{ $pdfImagePath }}" style="max-height: 50px; max-width: 180px; margin-bottom: 4px; display: block;" alt="Site Logo">
                    @endif
                   
                </td>

                <!-- Middle: Company Details -->
                <td style="width: 36%; padding-left: 10px;">
                    <div class="company-title">{{ strtoupper($companyName) }}</div>
                    <div class="company-info">
                        <span><b>Address:</b> {{ $companyAddress }}</span>
                        <span><b>Phone:</b> {{ $companyPhone }}</span>
                        <span><b>Email:</b> {{ $companyEmail }}</span>
                        <span><b>Website:</b> {{ $companyWebsite }}</span>
                    </div>
                </td>

                <!-- Right: Meta Box -->
                <td style="width: 32%;">
                    <table class="meta-table">
                        <tr>
                            <td>Date</td>
                            <td>{{ $invoice->created_at->format('n/j/Y') }}</td>
                        </tr>
                        <tr>
                            <td>Order Number</td>
                            <td>#{{ $invoice->order->order_number ?? ('LD-' . $invoice->order_id) }}</td>
                        </tr>
                        <tr>
                            <td>Invoice Number</td>
                            <td>{{ $invoice->invoice_number }}</td>
                        </tr>
                       
                    </table>
                </td>
            </tr>
        </table>

        <!-- Customer & Supplier Details Box -->
        <table class="info-table">
            <thead>
                <tr>
                    <th>Customer Details (Bill To)</th>
                    <th>Supplier Details (Assigned Carrier)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div class="info-row"><span class="info-label">Customer Name:</span><span class="info-val">{{ strtoupper($invoice->order->customer->name ?? 'N/A') }}</span></div>
                        <div class="info-row"><span class="info-label">Company Name:</span><span class="info-val">{{ strtoupper($invoice->order->customer->company_name ?? 'N/A') }}</span></div>
                        <div class="info-row"><span class="info-label">Address:</span><span class="info-val">{{ strtoupper($invoice->order->customer->address ?? 'N/A') }}</span></div>
                        <div class="info-row"><span class="info-label">Email:</span><span class="info-val">{{ strtoupper($invoice->order->customer->email ?? 'N/A') }}</span></div>
                        <div class="info-row"><span class="info-label">Phone:</span><span class="info-val">{{ $invoice->order->customer->phone_number ?? 'N/A' }}</span></div>
                    </td>
                    <td>
                        <div class="info-row"><span class="info-label">Supplier Name:</span><span class="info-val">{{ strtoupper($invoice->order->supplier->company_name ?? $invoice->order->supplier->name ?? 'N/A') }}</span></div>
                        <div class="info-row"><span class="info-label">Email:</span><span class="info-val">{{ strtoupper($invoice->order->supplier->email ?? 'N/A') }}</span></div>
                        <div class="info-row"><span class="info-label">Phone:</span><span class="info-val">{{ $invoice->order->supplier->phone_number ?? 'N/A' }}</span></div>
                        <div class="info-row"><span class="info-label">Pickup Address:</span><span class="info-val">{{ strtoupper($invoice->order->pickup_address ?? 'N/A') }}</span></div>
                        <div class="info-row"><span class="info-label">Delivery Address:</span><span class="info-val">{{ strtoupper($invoice->order->delivery_address ?? 'N/A') }}</span></div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Method / Transport Type / Status Box -->
        <table class="status-table">
            <thead>
                <tr>
                    <th style="width: 33.33%;">Payment Method</th>
                    <th style="width: 33.33%;">Service / Pallet Type</th>
                    <th style="width: 33.33%;">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ strtoupper($invoice->order->payment_method === 'pay_later' ? 'PAY LATER' : 'PAY NOW') }}</td>
                    <td>{{ strtoupper($invoice->order->pallet_type ?? 'ROAD FREIGHT') }}</td>
                    <td>{{ strtoupper($invoice->status) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th class="center" style="width: 20%;">Invoice #</th>
                    <th style="width: 45%;">Description of Service</th>
                    <th class="center" style="width: 10%;">QTY</th>
                    <th class="right" style="width: 12.5%;">Unit Price</th>
                    <th class="right" style="width: 12.5%;">Amount</th>
                </tr>
            </thead>
            <tbody>
                @if($invoice->order->items->isNotEmpty())
                    @foreach($invoice->order->items as $index => $item)
                    <tr>
                        <td class="center">{{ $invoice->invoice_number }}</td>
                        <td>
                            <b>{{ strtoupper($item->item_type) }}</b>
                            <br><span style="font-size:9px; color:#555;">FREIGHT TRANSPORT SERVICE ({{ $invoice->order->pickup_address ?? '' }} to {{ $invoice->order->delivery_address ?? '' }})</span>
                        </td>
                        <td class="center">{{ $item->quantity }}</td>
                        <td class="right">{{ number_format($baseFreightPrice, 2) }}</td>
                        <td class="right">{{ number_format(($item->quantity * $baseFreightPrice), 2) }}</td>
                    </tr>
                    @endforeach
                @else
                    <tr>
                        <td class="center">{{ $invoice->invoice_number }}</td>
                        <td>
                            <b>FREIGHT TRANSPORT SERVICE</b> ({{ strtoupper($invoice->order->pallet_type ?? 'EURO PALLETS') }})
                            <br><span style="font-size:9px; color:#555;">{{ $invoice->order->pickup_address ?? '' }} to {{ $invoice->order->delivery_address ?? '' }}</span>
                        </td>
                        <td class="center">1</td>
                        <td class="right">{{ number_format($baseFreightPrice, 2) }}</td>
                        <td class="right">{{ number_format($baseFreightPrice, 2) }}</td>
                    </tr>
                @endif
            </tbody>
        </table>

        <!-- Totals Section -->
        <div class="totals-container">
            <table class="totals-table">
                <tr class="sub-row">
                    <td style="width: 60%;">Base Freight Price</td>
                    <td style="width: 40%;">€{{ number_format($baseFreightPrice, 2) }}</td>
                </tr>
                @if($quote?->extraCharges && $quote->extraCharges->isNotEmpty())
                    @foreach($quote->extraCharges as $extra)
                    <tr class="sub-row">
                        <td>{{ $extra->custom_name ?? $extra->type ?? 'Extra Charge' }}</td>
                        <td>€{{ number_format($extra->amount, 2) }}</td>
                    </tr>
                    @endforeach  
                @endif
                <tr class="sub-row">
                    <td>System Service Charge</td>
                    <td>€{{ number_format($invoice->platform_fee, 2) }}</td>
                </tr>
            </table>
            <div class="clear"></div>

            <table class="grand-total-table">
                <tr>
                    <td class="grand-total-label">Total</td>
                    <td class="grand-total-val">€{{ number_format($invoice->total_amount, 2) }}</td>
                </tr>
            </table>
            <div class="clear"></div>
        </div>

    </div>

    <!-- Fixed Footer Bar -->
    <div class="footer-bar">
        AMSTERDAM &nbsp;|&nbsp; ROTTERDAM &nbsp;|&nbsp; BRUSSELS &nbsp;|&nbsp; BERLIN &nbsp;|&nbsp; PARIS &nbsp;|&nbsp; LONDON
    </div>

</body>
</html>
