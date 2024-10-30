<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        
        $request->session()->regenerate();

       $user = Auth::user();
        
        Log::info('User Login Attempt', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'timestamp' => now()
        ]);

        if($user->role == 'teacher' || $user->role == 'admin'){
            return redirect()->intended(route('teacher.dashboard', absolute: false));
        }

        return redirect()->intended(route('student.dashboard', absolute: false));


    }

    // public function store(LoginRequest $request): RedirectResponse
    // {
    //     $request->authenticate();
    //     $request->session()->regenerate();

    //     $user = Auth::user();
        
    //     Log::info('User Login Attempt', [
    //         'user_id' => $user->id,
    //         'email' => $user->email,
    //         'role' => $user->role,
    //         'timestamp' => now()
    //     ]);

    //     $redirect = match($user->role) {
    //         'teacher' => redirect()->route('teacher.dashboard'),
    //         'student' => redirect()->route('student.dashboard'),
    //         default => redirect('/dashboard')
    //     };

    //     Log::info('Login Redirect', [
    //         'user_id' => $user->id,
    //         'role' => $user->role,
    //         'redirect_to' => $redirect->getTargetUrl()
    //     ]);

    //     return $redirect;
    // }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
