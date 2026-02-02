<?php

namespace App\Http\Controllers\API\Supplier;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeApiController extends Controller
{
    use ApiResponse;

    /**
     * Get employees for the authenticated supplier.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = User::where('parent_id', auth()->id())
            ->where('user_type', 'supplier_employee');

        if ($search) {
            $query->where('email', 'LIKE', "%{$search}%");
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $employees = $query->latest()->paginate($request->input('per_page', 10));

        // Format for UI (matching the table columns in design)
        $employees->getCollection()->transform(function($employee) {
            return [
                'id' => $employee->id,
                'email' => $employee->email,
                'last_login' => $employee->last_login_at ? $employee->last_login_at->diffForHumans() : 'Never',
                'added_date' => $employee->created_at->format('d M Y'),
                'status' => $employee->status, // active, invited, disabled
            ];
        });

        return $this->sendResponse($employees, 'Employees retrieved successfully.');
    }

    /**
     * Add a new employee.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $employee = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'parent_id' => auth()->id(),
            'user_type' => 'supplier_employee',
            'status' => 'active',
            'name' => explode('@', $request->email)[0], // Default name from email
        ]);

        return $this->sendResponse($employee, 'Employee added successfully.', null, 201);
    }

    /**
     * Update employee status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,disabled'
        ]);

        $employee = User::where('parent_id', auth()->id())->find($id);

        if (!$employee) {
            return $this->sendError('Employee not found.', [], 404);
        }

        $employee->update(['status' => $request->status]);

        return $this->sendResponse($employee, "Employee status updated to {$request->status}.");
    }

    /**
     * Delete an employee.
     */
    public function destroy($id)
    {
        $employee = User::where('parent_id', auth()->id())->find($id);

        if (!$employee) {
            return $this->sendError('Employee not found.', [], 404);
        }

        $employee->delete();

        return $this->sendResponse(null, 'Employee deleted successfully.');
    }
}
