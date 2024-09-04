<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Services\ClassroomService;
use Illuminate\Http\Request;
use App\Http\Requests\ClassroomRequest;
use Inertia\Inertia;
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

    public function enroll(Request $request, Classroom $classroom)
    {
        $this->classroomService->enrollStudent($classroom, $request->user()->id);
        return back()->with('success', 'Enrolled successfully.');
    }

    public function unenroll(Request $request, Classroom $classroom)
    {
        $this->classroomService->unenrollStudent($classroom, $request->user()->id);
        return back()->with('success', 'Unenrolled successfully.');
    }
}