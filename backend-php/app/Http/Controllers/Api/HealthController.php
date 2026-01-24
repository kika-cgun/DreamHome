<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Basic health check - returns OK if the application is running
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'UP',
            'service' => 'DreamHome PHP Backend',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Detailed health check - checks database connectivity
     */
    public function healthDetails(): JsonResponse
    {
        $checks = [
            'application' => [
                'status' => 'UP',
            ],
            'database' => $this->checkDatabase(),
        ];

        $overallStatus = collect($checks)->every(fn($check) => $check['status'] === 'UP')
            ? 'UP'
            : 'DOWN';

        return response()->json([
            'status' => $overallStatus,
            'service' => 'DreamHome PHP Backend',
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks,
        ], $overallStatus === 'UP' ? 200 : 503);
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            $dbName = DB::connection()->getDatabaseName();

            return [
                'status' => 'UP',
                'database' => $dbName,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'DOWN',
                'error' => $e->getMessage(),
            ];
        }
    }
}
