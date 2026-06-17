<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsCustomer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user && $user->user_type === 'customer') {
            if (!$user->userSubscription || $user->userSubscription->status !== 'active' || $user->userSubscription->expires_at < now()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have an active subscription.',
                    'requires_subscription' => true
                ], 403);
            }

            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized access. Only customers are allowed.',
        ], 403);
    }
}
