<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\EnrolledStudent;
use Inertia\Inertia;
class SubjectController extends Controller
{


    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:subjects,code',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'year_level' => 'required|integer',
            'department' => 'required|string',
            'semester' => 'required|string',
        ]);

        $subject = Subject::create($validated);

        return response()->json([
            'message' => 'Subject created successfully',
            'subject' => $subject
        ], 201);
    }

    public function update(Request $request, $id)
{
    // Validate incoming request
    $validated = $request->validate([
        'code' => 'required|string|unique:subjects,code,' . $id,
        'name' => 'required|string',
        'description' => 'nullable|string',
        'year_level' => 'required|integer',
        'department' => 'required|string',
        'semester' => 'required|string',
    ]);

    // Find the subject by ID
    $subject = Subject::findOrFail($id);

    // Update the subject with validated data
    $subject->update($validated);

    return response()->json([
        'message' => 'Subject updated successfully',
        'subject' => $subject
    ], 200);
}

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

    public function getSubjects(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $query = Subject::query()
            ->when($search, function ($query, $search) {
                return $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('code', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc');

        $subjects = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($subjects);
    }

    public function index_subject()
    {
        return Inertia::render('teacher/Subjects/Index');
    }
    public function index_student_subject()
    {
        return Inertia::render('student/Subjects/Index');
    }

    public function index_student_analytics( $user_id, $classroom_id)
{
    // You can add any additional data you want to pass to the view
    return Inertia::render('teacher/Subjects/StudentAnalytics/Index', [
        'params' => [
            'user_id' => $user_id,
            'classroom_id' => $classroom_id
        ],
        // Add any other data you want to pass
    ]);
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

    
    public function get_enrolled_subject(Request $request)
    {
        $student = Auth::user();
    
        $subjects = EnrolledStudent::where('student_id', $student->id)
        ->with(['classroom.subject','classroom.teacher'])  // Eager load the teacher and subject relationships
        ->get();
      
    
        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }
    
    
}
