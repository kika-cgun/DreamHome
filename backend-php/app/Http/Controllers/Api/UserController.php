<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function me()
    {
        /** @var User $user */
        $user = auth()->user();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'phone' => $user->phone,
            'avatarUrl' => $user->avatar_url,
            'agencyName' => $user->agency_name,
            'role' => $user->role->value,
            'createdAt' => $user->created_at,
        ]);
    }

    public function update(Request $request)
    {
        try {
            /** @var User $user */
            $user = auth()->user();

            $validated = $request->validate([
                'firstName' => 'nullable|string|max:50',
                'lastName' => 'nullable|string|max:50',
                'phone' => 'nullable|string|max:15',
                'avatarUrl' => 'nullable|string|max:2048',
                'agencyName' => 'nullable|string|max:100',
            ]);

            // Only update fields that have non-empty values
            $updateData = [];
            if (isset($validated['firstName']) && $validated['firstName'] !== '') {
                $updateData['first_name'] = $validated['firstName'];
            }
            if (isset($validated['lastName']) && $validated['lastName'] !== '') {
                $updateData['last_name'] = $validated['lastName'];
            }
            if (isset($validated['phone']) && $validated['phone'] !== '') {
                $updateData['phone'] = $validated['phone'];
            }
            if (isset($validated['avatarUrl']) && $validated['avatarUrl'] !== '') {
                $updateData['avatar_url'] = $validated['avatarUrl'];
            }
            if (isset($validated['agencyName']) && $validated['agencyName'] !== '') {
                $updateData['agency_name'] = $validated['agencyName'];
            }

            if (!empty($updateData)) {
                $user->update($updateData);
                $user->refresh();
            }

            return response()->json([
                'id' => $user->id,
                'email' => $user->email,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'phone' => $user->phone,
                'avatarUrl' => $user->avatar_url,
                'agencyName' => $user->agency_name,
                'role' => $user->role->value,
                'createdAt' => $user->created_at,
            ]);
        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json(['error' => 'Failed to update profile: ' . $e->getMessage()], 500);
        }
    }

    public function index()
    {
        /** @var User $user */
        $user = auth()->user();

        if ($user->role->value !== 'ADMIN') {
            return response()->json(['error' => 'Only ADMINs can view all users'], 403);
        }

        $users = User::all();

        return response()->json($users->map(function ($u) {
            return [
                'id' => $u->id,
                'email' => $u->email,
                'firstName' => $u->first_name,
                'lastName' => $u->last_name,
                'phone' => $u->phone,
                'avatarUrl' => $u->avatar_url,
                'agencyName' => $u->agency_name,
                'role' => $u->role->value,
                'createdAt' => $u->created_at,
            ];
        }));
    }

    /**
     * Update user role (ADMIN only)
     */
    public function updateRole(Request $request, $id)
    {
        /** @var User $currentUser */
        $currentUser = auth()->user();

        if ($currentUser->role->value !== 'ADMIN') {
            return response()->json(['error' => 'Only ADMINs can update user roles'], 403);
        }

        $user = User::findOrFail($id);

        // Prevent admin from changing own role
        if ($user->id === $currentUser->id) {
            return response()->json(['error' => 'Cannot change your own role'], 400);
        }

        $validated = $request->validate([
            'role' => 'required|in:USER,AGENT,ADMIN',
        ]);

        // Use the Role enum from the same namespace as the User model
        $user->role = \App\Enums\Role::from($validated['role']);
        $user->save();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'phone' => $user->phone,
            'avatarUrl' => $user->avatar_url,
            'agencyName' => $user->agency_name,
            'role' => $user->role->value,
            'createdAt' => $user->created_at,
        ]);
    }

    /**
     * Delete user (ADMIN only)
     */
    public function destroy($id)
    {
        /** @var User $currentUser */
        $currentUser = auth()->user();

        if ($currentUser->role->value !== 'ADMIN') {
            return response()->json(['error' => 'Only ADMINs can delete users'], 403);
        }

        $user = User::findOrFail($id);

        // Prevent admin from deleting themselves
        if ($user->id === $currentUser->id) {
            return response()->json(['error' => 'Cannot delete your own account'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}

