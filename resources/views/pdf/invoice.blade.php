<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 14px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f4f4f4;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #ff5e3a;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-info h2 {
            margin: 0;
            color: #333;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 10px;
        }
        .status-due { background: #fff8e1; color: #fbc02d; }
        .status-paid { background: #e8f5e9; color: #4caf50; }
        
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .grid {
            display: table;
            width: 100%;
        }
        .col {
            display: table-cell;
            width: 33.33%;
            vertical-align: top;
        }
        .label {
            font-size: 12px;
            color: #777;
            margin-bottom: 2px;
        }
        .value {
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table th {
            background: #fcfcfc;
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #eee;
            color: #777;
            font-size: 12px;
        }
        table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        
        .amount-table {
            width: 300px;
            float: right;
            margin-top: 20px;
        }
        .amount-table td {
            border: none;
            padding: 5px 0;
        }
        .amount-table .total {
            font-size: 18px;
            font-weight: bold;
            color: #ff5e3a;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div style="float: left;">
                <div class="logo">GetItMoving</div>
                <div style="font-size: 12px; color: #777;">Efficient Logistics Solutions</div>
            </div>
            <div class="invoice-info" style="float: right;">
                <h2>INVOICE</h2>
                <div>#{{ $invoice->invoice_number }}</div>
                <div class="status-badge status-{{ $invoice->status }}">
                    {{ strtoupper($invoice->status) }}
                </div>
            </div>
            <div style="clear: both;"></div>
        </div>

        <div class="section">
            <div class="grid">
                <div class="col">
                    <div class="label">ORDER ID</div>
                    <div class="value">{{ $invoice->order->order_number }}</div>
                    
                    <div class="label">SERVICE TYPE</div>
                    <div class="value">{{ $invoice->order->service_type }}</div>
                </div>
                <div class="col">
                    <div class="label">SUPPLIER</div>
                    <div class="value">{{ $invoice->order->supplier->company_name ?? $invoice->order->supplier->name }}</div>
                    
                    <div class="label">DELIVERY DATE</div>
                    <div class="value">{{ \Carbon\Carbon::parse($invoice->order->pickup_date)->format('d M Y') }}</div>
                </div>
                <div class="col">
                    <div class="label">INVOICE DATE</div>
                    <div class="value">{{ $invoice->created_at->format('d F Y') }}</div>
                    
                    <div class="label">DUE DATE</div>
                    <div class="value">{{ \Carbon\Carbon::parse($invoice->due_date)->format('d F Y') }}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Shipping Routes</div>
            <div class="grid">
                <div class="col" style="width: 50%;">
                    <div class="label">PICKUP ADDRESS</div>
                    <div class="value">{{ $invoice->order->pickup_address }}</div>
                </div>
                <div class="col" style="width: 50%;">
                    <div class="label">DELIVERY ADDRESS</div>
                    <div class="value">{{ $invoice->order->delivery_address }}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Item Details</div>
            <table>
                <thead>
                    <tr>
                        <th>ITEM DESCRIPTION</th>
                        <th style="text-align: center;">QUANTITY</th>
                        <th style="text-align: right;">DIMENSIONS (CM)</th>
                        <th style="text-align: right;">WEIGHT (KG)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($invoice->order->items as $item)
                    <tr>
                        <td>{{ $item->item_type }}</td>
                        <td style="text-align: center;">{{ $item->quantity }}</td>
                        <td style="text-align: right;">
                            @if($item->length)
                                {{ $item->length }} x {{ $item->width }} x {{ $item->height }}
                            @else
                                N/A
                            @endif
                        </td>
                        <td style="text-align: right;">{{ $item->weight ?? 'N/A' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="clearfix">
            <table class="amount-table">
                <tr>
                    <td>Supplier Amount:</td>
                    <td style="text-align: right;">${{ number_format($invoice->supplier_amount, 2) }}</td>
                </tr>
                <tr>
                    <td>Platform Fee (5%):</td>
                    <td style="text-align: right;">${{ number_format($invoice->platform_fee, 2) }}</td>
                </tr>
                <tr class="total">
                    <td>Total Payable:</td>
                    <td style="text-align: right;">${{ number_format($invoice->total_amount, 2) }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <div>Secure payment powered by Stripe. Thank you for using GetItMoving.</div>
            <div style="margin-top: 5px;">If you have any questions, please contact support@getitmoving.com</div>
        </div>
    </div>
</body>
</html>
