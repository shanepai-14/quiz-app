<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Fetch users with the 'teacher' role.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */


    public function fetchTeachers(Request $request)
    {
        // Optionally filter by search term
        $search = $request->input('search');

        // Fetch users with the 'teacher' role
        $query = User::where('role', 'teacher');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        $teachers = $query->get();

        return response()->json($teachers);
    }
    public function fetchStudents(Request $request)
    {
        // Optionally filter by search term
        $search = $request->input('search');

        // Fetch users with the 'teacher' role
        $query = User::where('role', 'student');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        $students = $query->get();

        return response()->json($students);
    }

    public function getTeachers(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $query = User::where('role', 'teacher');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%");
            });
        }
       

        return  $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols()],
            'department' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
            'address' => ['nullable', 'string', 'max:500'],
            'birthday' => ['required', 'date', 'before:today'],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'with_admin_access' => ['required', 'boolean'],
            'role' => ['required', Rule::in(['teacher'])],
        ]);




        $validated['course'] = $validated['department'];
        $validated['year_level'] = '4th Year';

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        // Create user
        $user = User::create($validated);

        return back()->with('success', 'Teacher created successfully');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols()],
            'department' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
            'address' => ['nullable', 'string', 'max:500'],
            'birthday' => ['required', 'date', 'before:today'],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'with_admin_access' => ['required', 'boolean'],
        ]);

        // Only hash password if it's being updated
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

       
        return back()->with('success', 'Teacher updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->role !== 'teacher') {
            Log::warning('Attempted to delete non-teacher user', [
                'user_id' => $user->id,
                'role' => $user->role,
                'performed_by' => Auth::id(),
                'ip_address' => request()->ip()
            ]);
            
            return response()->json(['message' => 'User is not a teacher'], 403);
        }
    
        try {
            // Store user data before deletion for logging
            $teacherData = [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'department' => $user->department,
                'performed_by' => Auth::id(),
                'ip_address' => request()->ip()
            ];
            
            $user->delete(); // This will soft delete
    
            Log::info('Teacher successfully soft deleted', $teacherData);
    
            return back()->with('success', 'Teacher deleted successfully');
        
        } catch (\Exception $e) {
            Log::error('Failed to delete teacher', [
                'teacher_id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'performed_by' => Auth::id(),
                'ip_address' => request()->ip()
            ]);
    
            return back()->with('error', 'Failed to delete teacher');
        }
    }
}
