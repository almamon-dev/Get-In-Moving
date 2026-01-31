<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SettingsController extends Controller
{
    use ApiResponse;

    /**
     * Get customer profile information.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        return $this->sendResponse([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone_number,
            'company_name' => $user->company_name,
            'profile_picture' => $user->profile_picture,
        ], 'Profile retrieved successfully.');
    }

    /**
     * Update customer profile information.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        
        $user->name = $request->name ?? $user->name;
        $user->phone_number = $request->phone ?? $user->phone_number;
        $user->company_name = $request->company_name ?? $user->company_name;
        
        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('profile_pictures', $filename, 'public');
            $user->profile_picture = asset('storage/' . $path);
        }
        
        $user->save();

        return $this->sendResponse([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone_number,
            'company_name' => $user->company_name,
            'profile_picture' => $user->profile_picture,
        ], 'Profile updated successfully.');
    }

    /**
     * Change customer password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->sendError('Current password is incorrect.', [], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return $this->sendResponse(null, 'Password changed successfully.');
    }

    /**
     * Delete customer account.
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            return $this->sendError('Password is incorrect.', [], 422);
        }

        // Delete user's tokens
        $user->tokens()->delete();
        
        // Soft delete the user
        $user->delete();

        return $this->sendResponse(null, 'Account deleted successfully.');
    }
}
