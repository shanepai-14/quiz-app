<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

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
            $query->where(function($q) use ($search) {
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
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        $students = $query->get();

        return response()->json($students);
    }
}
