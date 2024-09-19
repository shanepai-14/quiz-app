<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrolled_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users');
            $table->foreignId('classroom_id')->constrained('classrooms');
            $table->enum('status', ['pending','enrolled', 'dropped', 'completed'])->default('pending');
            $table->dateTime('enrolled_at')->nullable();
            $table->dateTime('dropped_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();

            // Ensure a student can only be enrolled once per classroom
            $table->unique(['student_id', 'classroom_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrolled_students');
    }
};
