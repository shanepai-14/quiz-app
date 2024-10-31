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
        Schema::table('classrooms', function (Blueprint $table) {
            // Drop the existing foreign key
            $table->dropForeign(['teacher_id']);
            
            // Add the new foreign key with onDelete('set null')
            $table->foreign('teacher_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
            
            // Make teacher_id nullable
            $table->unsignedBigInteger('teacher_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classrooms', function (Blueprint $table) {
            // Drop the modified foreign key
            $table->dropForeign(['teacher_id']);
            
            // Restore the original foreign key
            $table->foreign('teacher_id')
                  ->references('id')
                  ->on('users');
                  
            // Make teacher_id not nullable again
            $table->unsignedBigInteger('teacher_id')->nullable(false)->change();
        });
    }
};
