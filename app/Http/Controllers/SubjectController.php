<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\Classroom;
use Inertia\Inertia;
class SubjectController extends Controller
{
   /**
     * Fetch subjects based on search query.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchSubjects(Request $request)
    {
        // Optionally filter by search term
        $search = $request->input('search');

        // Fetch subjects based on the search query
        $query = Subject::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        $subjects = $query->get();

        return response()->json($subjects);
    }

    public function index_subject()
    {
        return Inertia::render('teacher/Subjects/Index');
    }

    public function get_assigned_subject(Request $request)
    {
        $teacher = Auth::user();
    
        $subjects = Classroom::where('teacher_id', $teacher->id)
        ->with(['teacher', 'subject'])  // Eager load the teacher and subject relationships
        ->get();
      
    
        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }
    
}
