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
        $status = $request->input('status', 'all');

        $query = Order::query()
            ->with(['customer', 'supplier', 'invoice'])
            ->latest();

        // Count for stats
        $stats = [
            'total' => Order::whereIn('pod_status', ['rejected', 'confirmed'])->whereNotNull('pod_status')->count(),
            'rejected' => Order::where('pod_status', 'rejected')->count(),
            'pending' => Order::where('pod_status', 'rejected')->where('status', '!=', 'completed')->count(),
            'resolved' => Order::where('pod_status', 'confirmed')->where('status', 'completed')->count(),
        ];

        // Filter by rejection initially
        if ($status === 'all') {
            $query->where('pod_status', 'rejected');
        } elseif ($status === 'resolved') {
            $query->where('pod_status', 'confirmed');
        }

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
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status
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
