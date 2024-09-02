<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class EnrolledStudent extends Pivot
{
    protected $table = 'enrolled_students';

    public $incrementing = true;

    protected $fillable = [
        'student_id',
        'classroom_id',
        'status',
        'enrolled_at',
        'dropped_at',
        'completed_at',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'dropped_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
}