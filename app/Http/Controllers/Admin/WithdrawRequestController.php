<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WithdrawRequest;
use App\Models\SupplierTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class WithdrawRequestController extends Controller
{
    /**
     * Display a listing of withdrawal requests.
     */
    public function index(Request $request)
    {
        $status = $request->input('status', 'all');
        
        $query = WithdrawRequest::with('supplier')
            ->latest();
            
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $requests = $query->paginate(15)->withQueryString();
        
        return Inertia::render('Admin/Finance/Withdrawals/Index', [
            'withdrawRequests' => $requests,
            'filters' => [
                'status' => $status
            ]
        ]);
    }

    /**
     * Update the status of a withdrawal request.
     */
    public function updateStatus(Request $request, WithdrawRequest $withdrawRequest)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,completed',
            'admin_note' => 'nullable|string',
        ]);

        $oldStatus = $withdrawRequest->status;
        $newStatus = $request->status;

        if ($oldStatus === 'completed' || $oldStatus === 'rejected') {
            return redirect()->back()->with('error', 'This request has already been processed.');
        }

        try {
            DB::beginTransaction();

            if ($newStatus === 'rejected') {
                // Refund the balance to the supplier
                $withdrawRequest->supplier->increment('balance', $withdrawRequest->amount);
                
                // Record the refund transaction
                SupplierTransaction::create([
                    'supplier_id' => $withdrawRequest->supplier_id,
                    'amount' => $withdrawRequest->amount,
                    'type' => 'adjustment',
                    'description' => 'Refund for rejected withdrawal request (#' . $withdrawRequest->id . ')',
                ]);
            }

            $updateData = [
                'status' => $newStatus,
                'admin_note' => $request->admin_note,
            ];

            if ($newStatus === 'completed' || $newStatus === 'approved') {
                $updateData['processed_at'] = now();
            }

            $withdrawRequest->update($updateData);

            // Notify Supplier
            try {
                $withdrawRequest->supplier->notify(new \App\Notifications\WithdrawalStatusNotification($withdrawRequest));
            } catch (\Exception $e) {
                // Log notification failure but don't break the process
                \Illuminate\Support\Facades\Log::error('Withdrawal notification failed: ' . $e->getMessage());
            }

            DB::commit();

            return redirect()->back()->with('success', 'Withdrawal request status updated to ' . $newStatus);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update request status: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WithdrawRequest $withdrawRequest)
    {
        if ($withdrawRequest->status === 'pending') {
            return redirect()->back()->with('error', 'Cannot delete a pending request. Please reject it first.');
        }
        
        $withdrawRequest->delete();
        return redirect()->back()->with('success', 'Request deleted successfully.');
    }
}
