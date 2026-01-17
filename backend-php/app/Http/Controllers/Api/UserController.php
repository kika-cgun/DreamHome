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
}
