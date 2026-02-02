<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierAvailability extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'type',
        'route_name',
        'service_type',
        'trailer_type',
        'pickup_region',
        'delivery_region',
        'start_date',
        'end_date',
        'days_of_week',
        'start_time',
        'end_time',
        'price',
        'capacity_limit',
        'capacity_used',
        'min_weight',
        'max_weight',
        'notes',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'days_of_week' => 'array',
        'price' => 'decimal:2',
        'min_weight' => 'decimal:2',
        'max_weight' => 'decimal:2',
        'capacity_limit' => 'integer',
        'capacity_used' => 'integer',
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
}
