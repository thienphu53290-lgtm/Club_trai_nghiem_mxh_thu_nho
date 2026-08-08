<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LogtailService
{
    public static function audit(string $action, array $data = []): void
    {
        $payload = array_merge([
            'timestamp' => now()->toIso8601String(),
            'system' => 'Club-Trai-Nghiem-SuperAdmin',
            'environment' => config('app.env'),
            'action' => $action,
        ], $data);

        Log::channel('single')->info("[AUDIT_LOG] {$action}", $payload);

        $token = env('LOGTAIL_SOURCE_TOKEN', 'bE2dr2UfXL6uYAQ7FV7Akj7z');
        $endpoints = [
            'https://s2652046.eu-central-1a.betterstackdata.com',
            'https://in.logs.betterstack.com',
        ];

        foreach ($endpoints as $url) {
            try {
                $response = Http::withToken($token)->post($url, array_merge(['message' => "[ADMIN_AUDIT] {$action}"], $payload));
                Log::channel('single')->info("BetterStack Response for $url: " . $response->status() . " - " . $response->body());
            } catch (\Throwable $e) {
                Log::channel('single')->error("BetterStack HTTP Exception for $url: " . $e->getMessage());
            }
        }

        try {
            Log::channel('logtail')->info("[ADMIN_AUDIT] {$action}", $payload);
        } catch (\Throwable $e) {
            Log::channel('single')->error("Logtail error: " . $e->getMessage());
        }
    }

    public static function crud(string $entity, string $operation, int|string $targetId, array $changes = []): void
    {
        self::audit("CRUD_" . strtoupper($operation), [
            'entity' => $entity,
            'target_id' => $targetId,
            'changes' => $changes,
        ]);
    }

    public static function alert(string $message, array $context = []): void
    {
        Log::channel('single')->warning("[SYSTEM_ALERT] {$message}", $context);

        $token = env('LOGTAIL_SOURCE_TOKEN', 'bE2dr2UfXL6uYAQ7FV7Akj7z');
        $endpoints = [
            'https://s2652046.eu-central-1a.betterstackdata.com',
            'https://in.logs.betterstack.com',
        ];

        foreach ($endpoints as $url) {
            try {
                Http::withToken($token)->post($url, array_merge(['message' => "[SYSTEM_ALERT] {$message}", 'level' => 'warn'], $context));
            } catch (\Throwable $e) {
            }
        }

        try {
            Log::channel('logtail')->warning("[SYSTEM_ALERT] {$message}", $context);
        } catch (\Throwable $e) {
        }
    }
}
