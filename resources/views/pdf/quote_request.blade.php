<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quote Request Details</title>
    <style>
        @page {
            margin: 25px 30px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.5;
            background-color: #ffffff;
        }
        
        /* Brand Accent Bar */
        .top-accent {
            height: 6px;
            background: #f97316;
            margin-bottom: 20px;
            border-radius: 3px;
        }

        /* Header */
        .header-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .header-table td {
            vertical-align: top;
        }
        .brand-logo-text {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }
        .brand-logo-text span {
            color: #f97316;
        }
        .brand-subtext {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
            font-weight: 500;
        }
        .doc-title {
            text-align: right;
        }
        .doc-title h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }
        .doc-meta {
            font-size: 11px;
            color: #64748b;
            margin-top: 4px;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            border-radius: 12px;
            background-color: #fff7ed;
            color: #c2410c;
            border: 1px solid #ffedd5;
            margin-top: 5px;
        }

        /* Cards Grid */
        .grid-table {
            width: 100%;
            margin-bottom: 16px;
            border-collapse: separate;
            border-spacing: 12px 0;
            margin-left: -12px;
            margin-right: -12px;
        }
        .grid-col {
            width: 50%;
            vertical-align: top;
        }
        .card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 14px;
        }
        .card-header {
            font-size: 11px;
            font-weight: 700;
            color: #f97316;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px dashed #cbd5e1;
            padding-bottom: 6px;
            margin-bottom: 8px;
        }
        .info-row {
            margin-bottom: 5px;
            font-size: 11.5px;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-label {
            font-weight: 600;
            color: #475569;
            width: 120px;
            display: inline-block;
        }
        .info-value {
            color: #0f172a;
            font-weight: 500;
        }

        /* Section Title */
        .section-header {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 16px;
            margin-bottom: 8px;
            padding-left: 8px;
            border-left: 4px solid #f97316;
        }

        /* Table Styling */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 16px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .data-table th {
            background-color: #0f172a;
            color: #ffffff;
            font-size: 10.5px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 8px 10px;
            text-align: left;
            letter-spacing: 0.5px;
        }
        .data-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            font-size: 11.5px;
        }
        .data-table tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .data-table tr:last-child td {
            border-bottom: none;
        }

        /* Notes Box */
        .notes-box {
            background-color: #fff7ed;
            border: 1px solid #ffedd5;
            border-left: 4px solid #f97316;
            border-radius: 6px;
            padding: 10px 14px;
            margin-top: 12px;
            font-size: 11.5px;
            color: #9a3412;
        }
        .notes-title {
            font-weight: 700;
            margin-bottom: 4px;
            text-transform: uppercase;
            font-size: 10.5px;
            letter-spacing: 0.5px;
        }

        /* Footer */
        .footer {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            text-align: center;
            font-size: 10.5px;
            color: #94a3b8;
        }
        .footer strong {
            color: #f97316;
        }
    </style>
</head>
<body>
    <div class="top-accent"></div>

    <table class="header-table">
        <tr>
            <td>
                <div class="brand-logo-text">GET IT <span>MOVING</span></div>
                <div class="brand-subtext">Fast &amp; Reliable Freight Logistics Solutions</div>
            </td>
            <td class="doc-title">
                <h1>Quote Request</h1>
                <div class="doc-meta">
                    Ref #: <strong>#{{ $quoteRequest->id }}</strong> &bull; {{ now()->format('j M Y, h:i A') }}
                </div>
                <div>
                    <span class="status-badge">{{ ucfirst($quoteRequest->status ?? 'Active') }}</span>
                </div>
            </td>
        </tr>
    </table>

    <table class="grid-table">
        <tr>
            <td class="grid-col">
                <div class="card">
                    <div class="card-header">General Information</div>
                    <div class="info-row">
                        <span class="info-label">Customer Name:</span>
                        <span class="info-value">{{ $quoteRequest->user->name ?? 'Customer' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Service Type:</span>
                        <span class="info-value">{{ !empty($quoteRequest->pallet_type) ? $quoteRequest->pallet_type : $quoteRequest->getPalletType() }}</span>
                    </div>
                </div>
            </td>
            <td class="grid-col">
                <div class="card">
                    <div class="card-header">Service Summary</div>
                    <div class="info-row">
                        <span class="info-label">Total Items:</span>
                        <span class="info-value">{{ count($quoteRequest->items ?? []) }} Item(s)</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Attachment:</span>
                        <span class="info-value">{{ !empty($quoteRequest->attachment_path) ? 'Yes' : 'None' }}</span>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <div class="section-header">Pickup &amp; Delivery Details</div>

    <table class="grid-table">
        <tr>
            <td class="grid-col">
                <div class="card">
                    <div class="card-header">Pickup Location</div>
                    <div class="info-row">
                        <span class="info-label">Address:</span>
                        <span class="info-value">{{ $quoteRequest->pickup_address }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Date:</span>
                        <span class="info-value">
                            {{ (empty($quoteRequest->pickup_date) || str_contains($quoteRequest->pickup_date, '_')) ? $quoteRequest->pickup_date : \Carbon\Carbon::parse($quoteRequest->pickup_date)->format('j M Y') }}
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Time Window:</span>
                        <span class="info-value">{{ $quoteRequest->pickup_time_from ?? 'N/A' }} - {{ $quoteRequest->pickup_time_till ?? 'N/A' }}</span>
                    </div>
                </div>
            </td>
            <td class="grid-col">
                <div class="card">
                    <div class="card-header">Delivery Location</div>
                    <div class="info-row">
                        <span class="info-label">Address:</span>
                        <span class="info-value">{{ $quoteRequest->delivery_address }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Date:</span>
                        <span class="info-value">
                            {{ (empty($quoteRequest->delivery_date) || str_contains($quoteRequest->delivery_date, '_')) ? $quoteRequest->delivery_date : \Carbon\Carbon::parse($quoteRequest->delivery_date)->format('j M Y') }}
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Time Window:</span>
                        <span class="info-value">{{ $quoteRequest->delivery_time_from ?? 'N/A' }} - {{ $quoteRequest->delivery_time_till ?? 'N/A' }}</span>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <div class="section-header">Items List &amp; Cargo Specifications</div>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 35%;">Item / Pallet Type</th>
                <th style="width: 15%;">Quantity</th>
                <th style="width: 25%;">Dimensions (L x W x H) cm</th>
                <th style="width: 20%;">Weight (kg)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($quoteRequest->items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td><strong>{{ $item->item_type }}</strong></td>
                <td>{{ $item->quantity }} unit(s)</td>
                <td>{{ $item->length ?? 'N/A' }} &times; {{ $item->width ?? 'N/A' }} &times; {{ $item->height ?? 'N/A' }}</td>
                <td>{{ $item->weight ?? 'N/A' }} kg</td>
            </tr>
            @empty
            <tr>
                <td>1</td>
                <td><strong>Euro Pallets</strong></td>
                <td>1 unit(s)</td>
                <td>120 &times; 80 &times; 100</td>
                <td>100 kg</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    @if(!empty($quoteRequest->additional_notes) && !str_contains($quoteRequest->additional_notes, '____'))
    <div class="notes-box">
        <div class="notes-title">Additional Instructions / Notes</div>
        <div>{!! strip_tags($quoteRequest->additional_notes) !!}</div>
    </div>
    @endif

    <div class="footer">
        <p>This document is generated by <strong>GET IT MOVING</strong> Logistics Platform &bull; All Rights Reserved</p>
    </div>
</body>
</html>
