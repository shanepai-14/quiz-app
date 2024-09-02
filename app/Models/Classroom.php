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

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function enrolledStudents()
    {
        return $this->belongsToMany(User::class, 'enrolled_students', 'classroom_id', 'student_id')
                    ->using(EnrolledStudent::class)
                    ->withPivot('status', 'enrolled_at', 'dropped_at', 'completed_at')
                    ->withTimestamps();
    }
}