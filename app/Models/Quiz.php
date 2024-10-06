<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'classroom_id', 
        'title', 
        'description', 
        'questions', 
        'learning_materials', 
        'submitted_count', 
        'start_time', 
        'end_time', 
        'time_limit'
    ];

    // Cast the questions field as an array (JSON)
    protected $casts = [
        'questions' => 'array',
    ];

    // Relationship with Class model
    public function class()
    {
        return $this->belongsTo(Classroom::class);
    }
}

