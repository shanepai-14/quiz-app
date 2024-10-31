<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CheckAdminAccess
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::user() || !Auth::user()->with_admin_access) {
            // For API requests
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
            }
            
            // For web requests
            return redirect()->back()->with('error', 'You do not have admin access.');
            // Or redirect to a specific route:
            // return redirect()->route('dashboard')->with('error', 'You do not have admin access.');
        }

        return $next($request);
    }
}