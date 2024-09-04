<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next

     * @return mixed
     */
    public function handle(Request $request, Closure $next,)
    {
        if (Auth::check()) {
            // Check if the user has the correct role
            if (Auth::user()->role === 'teacher') {
                return $next($request);
            }
        }


        // Redirect the user if they don't have the correct role
        return redirect('/unauthorized');
    }   
}
