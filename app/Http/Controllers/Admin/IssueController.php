<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IssueController extends Controller
{
    /**
     * Display a listing of orders with issues (rejected PODs).
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Order::where('pod_status', 'rejected')
            ->with(['customer', 'supplier', 'invoice'])
            ->latest();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('supplier', function($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $issues = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Issues/Index', [
            'issues' => $issues,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * Resolve an issue (Admin manual override).
     */
    public function resolve(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        // Logic to mark as resolved or completed
        $order->update([
            'pod_status' => 'confirmed',
            'status' => 'completed',
            'status_note' => $order->status_note . "\n\nResolved by Admin: " . $request->note
        ]);

        return back()->with('success', 'Issue marked as resolved.');
    }
}
