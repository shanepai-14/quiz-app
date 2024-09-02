<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClassroomController;
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
Route::get('/classroom', function () {
    return Inertia::render('teacher/Classroom');
})->middleware(['auth', 'verified'])->name('classroom');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/get_classrooms', [ClassroomController::class, 'index'])->name('get_classrooms');
    Route::resource('classrooms', ClassroomController::class);
    Route::post('classrooms/{classroom}/enroll', [ClassroomController::class, 'enroll'])->name('classrooms.enroll');
    Route::post('classrooms/{classroom}/unenroll', [ClassroomController::class, 'unenroll'])->name('classrooms.unenroll');

});

require __DIR__.'/auth.php';
