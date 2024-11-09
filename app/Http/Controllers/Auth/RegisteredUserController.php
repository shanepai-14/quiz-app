<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'required|string',
            'course' => 'required|string',
            'year_level' => 'required|string',
            'gender' => 'required|string',
            'contact_number' => 'nullable|string',
            'position' => 'nullable|string',
            'department' => 'nullable|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'nullable|string',
        ]);

        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $image = $request->file('profile_picture');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/profile_pictures', $filename);
            $profilePicturePath = str_replace('public/', '', $path);
        }

        $user = User::create([
            'role' => $request->role ?? 'student', // Default role to 'student' if not provided
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'course' => $request->course,
            'year_level' => $request->year_level,
            'gender' => $request->gender,
            'profile_picture' => $profilePicturePath,
            'email' => $request->email,
            'position' =>  $request->position,
            'department' =>  $request->department,
            'contact_number' => $request->contact_number,
            'password' => Hash::make($request->password), 
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('student.dashboard', absolute: true));
    }
}
