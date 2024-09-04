<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubjectController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('teacher/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/get_classrooms', [ClassroomController::class, 'get_classroom'])->name('get_classrooms');

    Route::middleware(['isTeacher'])->group(function () {

        Route::get('/teacher/classroom', [ClassroomController::class, 'index_teacher'])->middleware(['auth', 'verified'])->name('teacher.classroom');
    });

    Route::get('/student/classroom', [ClassroomController::class, 'index_teacher'])->middleware(['auth', 'verified'])->name('student.classroom');

    Route::post('classrooms_store', [ClassroomController::class, 'store'])->name('classrooms_store');
    Route::post('classrooms/{classroom}/enroll', [ClassroomController::class, 'enroll'])->name('classrooms.enroll');
    Route::post('classrooms/{classroom}/unenroll', [ClassroomController::class, 'unenroll'])->name('classrooms.unenroll');

    Route::get('/get_teachers', [UserController::class, 'fetchTeachers'])->name('get_teachers');
    Route::get('/subjects', [SubjectController::class, 'fetchSubjects'])->name('get_subjects');
});

require __DIR__ . '/auth.php';
