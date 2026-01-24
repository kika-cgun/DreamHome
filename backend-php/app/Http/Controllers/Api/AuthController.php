<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\JwtService;
use App\Enums\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Transform user model to API response format (camelCase)
     */
    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'email' => $user->email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'role' => $user->role->value,
            'avatarUrl' => $user->avatar_url,
            'phone' => $user->phone,
            'agencyName' => $user->agency_name,
            'createdAt' => $user->created_at?->toISOString(),
        ];
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'firstName' => 'nullable|string',
            'lastName' => 'nullable|string',
            'phone' => 'nullable|string',
            'role' => 'nullable|in:USER,AGENT,ADMIN',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'first_name' => $validated['firstName'] ?? null,
            'last_name' => $validated['lastName'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'] ?? 'USER',
        ]);

        $token = $this->jwtService->generateToken($user);

        return response()->json([
            'token' => $token,
            'user' => $this->transformUser($user),
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        // Use password_verify directly to handle both $2a$ (Java BCrypt) and $2y$ (PHP BCrypt)
        if (!$user || !password_verify($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $this->jwtService->generateToken($user);

        return response()->json([
            'token' => $token,
            'user' => $this->transformUser($user),
        ]);
    }
}
