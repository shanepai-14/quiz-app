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
        Schema::create('answers', function (Blueprint $table) {
            $table->id();  // Primary key: answer_id
            $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');  // Foreign key to quizzes table
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');  // Foreign key to users table (students)
            $table->json('submitted_answers');  // JSON format for storing submitted answers
            $table->integer('score')->nullable();  // Score for the entire quiz submission
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
