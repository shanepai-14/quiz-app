<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'room_code',
        'description',
        'teacher_id',
        'subject_id',
        'status',
        'start_date',
        'end_date',
        'max_students',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    protected $appends = ['teacher_full_name','subject_name','subject_code'];

    public function getTeacherFullNameAttribute()
    {
        return $this->teacher ? $this->teacher->first_name . " " . $this->teacher->last_name : null;
    }

    public function getSubjectNameAttribute()
    {
        return $this->subject ? $this->subject->name : null;
    }
    public function getSubjectCodeAttribute()
    {
        return $this->subject ? $this->subject->code: null;
    }
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
    public function enrolledStudents()
    {
        return $this->belongsToMany(User::class, 'enrolled_students', 'classroom_id', 'student_id')
                    ->using(EnrolledStudent::class)
                    ->withPivot('status', 'enrolled_at', 'dropped_at', 'completed_at')
                    ->withTimestamps();
    }

    public function getCompletionRate()
    {
        $totalQuizzes = $this->quizzes()->count();
        if ($totalQuizzes === 0) return 0;

        $completedQuizzes = Answer::whereIn('quiz_id', $this->quizzes->pluck('id'))
            ->distinct('quiz_id')
            ->count();

        return ($completedQuizzes / $totalQuizzes) * 100;
    }

    public function getAverageScore()
    {
        return Answer::whereIn('quiz_id', $this->quizzes->pluck('id'))
            ->avg('score') ?? 0;
    }
}