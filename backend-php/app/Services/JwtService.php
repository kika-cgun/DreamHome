<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;

class JwtService
{
    private string $secret;
    private int $expiration;

    public function __construct()
    {
        $this->secret = env('JWT_SECRET');
        $this->expiration = (int) env('JWT_EXPIRATION', 86400000); // milliseconds
    }

    public function generateToken(User $user): string
    {
        $payload = [
            'sub' => $user->id,
            'email' => $user->email,
            'role' => $user->role->value,
            'iat' => time(),
            'exp' => time() + ($this->expiration / 1000), // convert ms to seconds
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function validateToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getUserFromToken(string $token): ?User
    {
        $payload = $this->validateToken($token);

        if (!$payload) {
            return null;
        }

        return User::find($payload->sub);
    }
}
