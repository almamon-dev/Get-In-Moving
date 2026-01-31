<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AccountVerifiedNotification;
use App\Notifications\ComplianceApprovedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of suppliers.
     */
    public function index(Request $request)
    {
        $query = User::with(['subscription.pricingPlan'])->where('user_type', 'supplier');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('policy_number', 'like', "%{$search}%");
            });
        }

        // Filter by verification status
        if ($request->has('verified') && $request->verified !== null) {
            $query->where('is_verified', $request->verified);
        }

        // Filter by compliance status
        if ($request->has('compliance') && $request->compliance !== null) {
            $query->where('is_compliance_verified', $request->compliance);
        }

        $suppliers = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'verified', 'compliance']),
            'stats' => [
                'total' => User::where('user_type', 'supplier')->count(),
                'verified' => User::where('user_type', 'supplier')->where('is_verified', true)->count(),
                'compliance_verified' => User::where('user_type', 'supplier')->where('is_compliance_verified', true)->count(),
                'compliance_pending' => User::where('user_type', 'supplier')->where('is_compliance_verified', false)->count(),
            ],
        ]);
    }

    /**
     * Display the specified supplier.
     */
    public function show(User $supplier)
    {
        return Inertia::render('Admin/Suppliers/Show', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Update compliance verification status.
     */
    public function updateCompliance(Request $request, User $supplier)
    {
        $request->validate([
            'is_compliance_verified' => 'required|boolean',
        ]);

        $supplier->update([
            'is_compliance_verified' => $request->is_compliance_verified,
            'compliance_verified_at' => $request->is_compliance_verified ? now() : null,
        ]);

        // Send notification if compliance approved
        if ($request->is_compliance_verified) {
            $supplier->notify(new ComplianceApprovedNotification);
        }

        return redirect()->back()
            ->with('success', 'Compliance status updated successfully.');
    }

    /**
     * Update verification status.
     */
    public function updateVerification(Request $request, User $supplier)
    {
        $request->validate([
            'is_verified' => 'required|boolean',
        ]);

        $supplier->update([
            'is_verified' => $request->is_verified,
            'verified_at' => $request->is_verified ? now() : null,
            'email_verified_at' => $request->is_verified ? now() : null,
        ]);

        // Send notification if verified
        if ($request->is_verified) {
            $supplier->notify(new AccountVerifiedNotification('supplier'));
        }

        return redirect()->back()
            ->with('success', 'Verification status updated successfully.');
    }

    /**
     * Remove the specified supplier.
     */
    public function destroy(User $supplier)
    {
        $supplier->delete();

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier deleted successfully.');
    }
}
