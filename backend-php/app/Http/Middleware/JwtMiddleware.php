<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\JwtService;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    protected JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        // Check X-JWT-Token header first (for production where Authorization is used for Basic Auth)
        // Then fallback to standard Bearer token (for local development)
        $token = $request->header('X-JWT-Token') ?? $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = $this->jwtService->getUserFromToken($token);

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $request->attributes->set('user', $user);
        auth()->setUser($user);

        return $next($request);
    }
}
