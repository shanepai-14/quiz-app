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
    Route::resource('classrooms', ClassroomController::class);
    Route::post('classrooms/{classroom}/enroll', [ClassroomController::class, 'enroll'])->name('classrooms.enroll');
    Route::post('classrooms/{classroom}/unenroll', [ClassroomController::class, 'unenroll'])->name('classrooms.unenroll');

    Route::get('/get_teachers', [UserController::class, 'fetchTeachers'])->name('get_teachers');
    Route::get('/subjects', [SubjectController::class, 'fetchSubjects'])->name('get_subjects');
    
    Route::get('/classroom', [ClassroomController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('classroom');

});

require __DIR__.'/auth.php';
