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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();  // Primary Key: quiz_id
            $table->foreignId('classroom_id')->constrained('classrooms');
            $table->string('title');  // Title of the quiz
            $table->text('description')->nullable();  // Optional description
            $table->text('learning_materials')->nullable(); 
            $table->json('questions');  // Store questions in JSON format
            $table->integer('submitted_count')->default(0);
            $table->dateTime('start_time')->nullable();  // Start time of the quiz
            $table->dateTime('end_time')->nullable();  // End time of the quiz
            $table->integer('time_limit')->nullable();  // Time limit in minutes
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
