<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\QuizController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

// Route::get('/teacher/dashboard', function () {
//     return Inertia::render('teacher/Dashboard');
// })->middleware(['auth', 'verified'])->name('teacher.dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('student/Dashboard');
})->middleware(['auth', 'verified'])->name('student.dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/student/profile', [ProfileController::class, 'index_profile'])->name('profile.student');
    Route::get('/teacher/profile', [ProfileController::class, 'index_profile'])->name('profile.teacher');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/update_profile', [ProfileController::class, 'updateProfile'])->name('profile.user.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/get_classrooms', [ClassroomController::class, 'get_classroom'])->name('get_classrooms');
    
    Route::middleware(['isTeacher'])->group(function () {

     Route::get('/teacher/dashboard', [QuizController::class, 'TeacherAnalytics'])->name('teacher.dashboard');
     Route::get('/teacher/classroom', [ClassroomController::class, 'index_teacher'])->middleware(['auth', 'verified'])->name('teacher.classroom');
     Route::get('/teacher/subjects', [SubjectController::class, 'index_subject'])->middleware(['auth', 'verified'])->name('teacher.subject');
     Route::get('/teacher/subjects/student/{user_id}/classroom/{classroom_id}', [SubjectController::class, 'index_student_analytics'])
    ->middleware(['auth', 'verified'])
    ->name('teacher.student.analytics');
     Route::get('/teacher/assigned/subjects', [SubjectController::class, 'get_assigned_subject'])->middleware(['auth', 'verified'])->name('get_teacher_subject');
     
    
     Route::put('/enrollment/{enrollmentId}', [ClassroomController::class, 'updateEnrollmentStatus']);
     
    Route::post('/generate-quiz', [QuizController::class, 'generateQuizContent'])->name('generateQuizContent');
    Route::post('/store-quiz', [QuizController::class, 'store'])->name('storeQuiz');
    Route::get('/quizzes/classroom/{classroom_id}', [QuizController::class, 'getQuizzesByClassroom']);
   
    });
    Route::get('/classroom/{roomCode}/students', [ClassroomController::class, 'getClassroomStudents']);
    Route::get('/student/enrolled/subjects', [SubjectController::class, 'get_enrolled_subject'])->middleware(['auth', 'verified'])->name('get_student_subject');
    Route::get('/student/subjects', [SubjectController::class, 'index_student_subject'])->middleware(['auth', 'verified'])->name('student.subject');
    Route::get('/student/classroom', [ClassroomController::class, 'index_teacher'])->middleware(['auth', 'verified'])->name('student.classroom');

    Route::post('classrooms_store', [ClassroomController::class, 'store'])->name('classrooms_store');
    Route::post('classrooms/{room_code}/enroll', [ClassroomController::class, 'enroll'])->name('classrooms.enroll');
    Route::post('classrooms/{classroom}/unenroll', [ClassroomController::class, 'unenroll'])->name('classrooms.unenroll');

    Route::get('/get_students', [UserController::class, 'fetchStudents'])->name('get_students');
    Route::get('/get_teachers', [UserController::class, 'fetchTeachers'])->name('get_teachers');
    Route::get('/subjects', [SubjectController::class, 'fetchSubjects'])->name('get_subjects');
    Route::post('/subjects', [SubjectController::class, 'store'])->name('subjects.store');
    Route::get('/subjects_paginated', [SubjectController::class, 'getSubjects'])->name('get_subjects_paginated');

    Route::get('/quizzes/classroom/{classroom_id}/student', [QuizController::class, 'getQuizzesByClassroomStudent']);
    Route::post('/answer', [AnswerController::class, 'store'])->name('answer_store');
    Route::get('/answers/{quiz_id}/details/{user_id}', [AnswerController::class, 'getAnswerDetails'])->name('answers.details');
    Route::get('/rankings/classroom/{classroom_id}', [QuizController::class, 'getClassroomRankings'])->name('rankings.classroom');
    Route::get('/rankings/quiz/{quiz_id}', [QuizController::class, 'getQuizRankings'])->name('rankings.quiz');

    Route::get('/student/{user_id}/classroom/{classroom_id}/analytics', [QuizController::class, 'getStudentAnalytics'])
    ->name('student.analytics');

    Route::get('/student/overall-analytics/{user_id}', [QuizController::class, 'getAllStudentAnalytics'])
     ->name('student.overall-analytics');
});

require __DIR__ . '/auth.php';
