<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->trang_thai == 0) {
            return response()->json([
                'status' => false,
                'message' => 'account_locked',
                'error' => 'Tài khoản của bạn đã bị khóa.'
            ], 403);
        }

        return $next($request);
    }
}
