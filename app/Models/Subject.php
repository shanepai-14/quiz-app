<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'year_level',
        'department',
        'semester',
    ];

    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }

    // If you want to get all students enrolled in classrooms of this subject
    public function students()
    {
        return $this->hasManyThrough(
            User::class,
            Classroom::class,
            'subject_id', // Foreign key on classrooms table
            'id', // Foreign key on users table
            'id', // Local key on subjects table
            'student_id' // Local key on pivot table (enrolled_students)
        );
    }
}