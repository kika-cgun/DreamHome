<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me()
    {
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
        $user = auth()->user();

        $validated = $request->validate([
            'firstName' => 'nullable|string',
            'lastName' => 'nullable|string',
            'phone' => 'nullable|string',
            'avatarUrl' => 'nullable|string',
            'agencyName' => 'nullable|string',
        ]);

        $user->update([
            'first_name' => $validated['firstName'] ?? $user->first_name,
            'last_name' => $validated['lastName'] ?? $user->last_name,
            'phone' => $validated['phone'] ?? $user->phone,
            'avatar_url' => $validated['avatarUrl'] ?? $user->avatar_url,
            'agency_name' => $validated['agencyName'] ?? $user->agency_name,
        ]);

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

    public function index()
    {
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

