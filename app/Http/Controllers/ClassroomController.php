<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Services\ClassroomService;
use Illuminate\Http\Request;
use App\Http\Requests\ClassroomRequest;
use App\Models\EnrolledStudent;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class ClassroomController extends Controller
{
    protected $classroomService;

    public function __construct(ClassroomService $classroomService)
    {
        $this->classroomService = $classroomService;
    }

    public function index_teacher()
    {
        return Inertia::render('teacher/Classroom/Index');
    }


    public function get_classroom(Request $request)
    {
        $classrooms = Classroom::with(['teacher', 'subject'])->paginate(10);

        return response()->json($classrooms);
    }



    public function create()
    {
        return inertia('Classrooms/Create');
    }

    public function store(ClassroomRequest $request)
    {
        $classroom = $this->classroomService->createClassroom($request->validated());
        return response()->json($classroom);
    }

    public function show(Classroom $classroom)
    {
        $classroom->load(['teacher', 'subject', 'students']);
        return inertia('Classrooms/Show', compact('classroom'));
    }

    public function edit(Classroom $classroom)
    {
        return inertia('Classrooms/Edit', compact('classroom'));
    }

    public function update(ClassroomRequest $request, Classroom $classroom)
    {
        $this->classroomService->updateClassroom($classroom, $request->validated());
        return redirect()->route('classrooms.show', $classroom)
            ->with('success', 'Classroom updated successfully.');
    }

    public function destroy(Classroom $classroom)
    {
        $this->classroomService->deleteClassroom($classroom);
        return redirect()->route('classrooms.index')
            ->with('success', 'Classroom deleted successfully.');
    }

    public function enroll(Request $request, $room_code)
    {
        // Find the classroom by room_code
        $classroom = Classroom::where('room_code', $room_code)->first();
    
        // If the classroom is not found, return a JSON error response
        if (!$classroom) {
            return response()->json([
                'success' => false,
                'message' => 'Classroom not found.',
            ], 404);
        }
    
        // Enroll the student using the classroomService
        $this->classroomService->enrollStudent($classroom, $request->user_id, $request->status);
    
        // Return a successful JSON response after enrollment
        return response()->json([
            'success' => true,
            'message' => 'Enrolled successfully.',
        ], 200);
    }
    

    public function unenroll(Request $request, Classroom $classroom)
    {
        $this->classroomService->unenrollStudent($classroom, $request->user()->id);
        return back()->with('success', 'Unenrolled successfully.');
    }
    public function getClassroomStudents($roomCode)
    {
        $user = Auth::user();
        $role = $user->role;
        $now = now();
        
        $classroom = Classroom::where('room_code', $roomCode)->firstOrFail();
        
        $enrolledStudents = EnrolledStudent::where('classroom_id', $classroom->id)
            ->where('status', 'enrolled')
            ->with('student')
            ->get()
            ->map(function ($enrollment) use ($role, $now) {
                // Base query for answers
                $query = DB::table('answers')
                    ->join('quizzes', 'answers.quiz_id', '=', 'quizzes.id')
                    ->where('quizzes.classroom_id', $enrollment->classroom_id)
                    ->where('answers.user_id', $enrollment->student_id);
    
                // If user is a student, only include scores from quizzes past their deadline
                if ($role === 'student') {
                    $query->where('quizzes.end_time', '<', $now);
                }
    
                // Calculate average score
                $average = $query->avg('answers.score');
                
                // Get completed quizzes count
                $completedQuizzes = $query->count();
                
                // Get total quizzes count (for completion rate)
                $totalQuizzes = DB::table('quizzes')
                    ->where('classroom_id', $enrollment->classroom_id);
                
                if ($role === 'student') {
                    $totalQuizzes->where('end_time', '<', $now);
                }
                
                $totalQuizzesCount = $totalQuizzes->count();
    
                $enrollment->average_score = $average ? round($average, 2) : 0;
                $enrollment->completed_quizzes = $completedQuizzes;
                $enrollment->total_quizzes = $totalQuizzesCount;
                $enrollment->completion_rate = $totalQuizzesCount > 0 
                    ? round(($completedQuizzes / $totalQuizzesCount) * 100, 2) 
                    : 0;
    
                return $enrollment;
            });
    
        $pendingStudents = EnrolledStudent::where('classroom_id', $classroom->id)
            ->where('status', 'pending')
            ->with('student')
            ->get();
    
        return response()->json([
            'enrolled' => $enrolledStudents,
            'pending' => $pendingStudents,
            'classroom' => $classroom,
            'user_role' => $role // Added to help frontend handle conditional rendering
        ]);
    }

    public function updateEnrollmentStatus(Request $request, $enrollmentId)
    {
        $enrollment = EnrolledStudent::findOrFail($enrollmentId);
        $enrollment->status = $request->input('status'); // 'enrolled' or 'declined'
        $enrollment->save();

        return response()->json(['message' => 'Enrollment status updated successfully']);
    }
}