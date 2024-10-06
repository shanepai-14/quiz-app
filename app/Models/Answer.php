<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id', 
        'user_id', 
        'submitted_answers', 
        'score'
    ];

    protected $casts = [
        'submitted_answers' => 'array',  
    ];

    // Relationship with Quiz
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    // Relationship with User (Student)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
