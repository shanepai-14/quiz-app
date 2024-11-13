<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\User;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */

     public function index_profile()
     {
         return Inertia::render('student/Profile/UserProfile');
     }
 

     public function updateProfile(Request $request)
     { 
         $id = Auth::user()->id;
         $user = User::findOrFail($id);
         
         $validated = $request->validate([
             'first_name' => 'required|string|max:255',
             'middle_name' => 'nullable|string|max:255',
             'last_name' => 'required|string|max:255',
             'email' => 'required|email|unique:users,email,'.$user->id,
             'gender' => 'required|in:Male,Female,Other',
             'course' => 'nullable|string|max:255',
             'year_level' => 'nullable|string|max:255',
             'birthday' => 'required|date',
             'contact_number' => 'nullable|string|max:255',
             'address' => 'nullable|string',
             'department' => 'nullable|string|max:255',
             'position' => 'nullable|string|max:255',
             'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
         ]);
     
         // Remove profile_picture from validated data if it's null in the request
         if ($request->profile_picture === null) {
             unset($validated['profile_picture']);
         }
         // Only process profile picture if a file was actually uploaded
         elseif ($request->hasFile('profile_picture')) {
             // Delete old image if exists
             if ($user->profile_picture) {
                 Storage::disk('public')->delete($user->profile_picture);
             }
             
             // Store new image
             $path = $request->file('profile_picture')->store('profile_pictures', 'public');
             $validated['profile_picture'] = $path;
         }
     
         $user->update($validated);
     
         return redirect()->back()->with('message', 'Profile updated successfully');
     }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
