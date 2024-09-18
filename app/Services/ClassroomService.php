<?php

namespace App\Services;

use App\Models\Classroom;
use Illuminate\Support\Str;

class ClassroomService
{
    public function createClassroom(array $data)
    {
        $data['room_code'] = $this->generateUniqueRoomCode();
        return Classroom::create($data);
    }

    public function updateClassroom(Classroom $classroom, array $data)
    {
        $classroom->update($data);
        return $classroom;
    }

    public function deleteClassroom(Classroom $classroom)
    {
        return $classroom->delete();
    }

    public function enrollStudent(Classroom $classroom, $studentId)
    {
        return $classroom->enrolledStudents()->attach($studentId, [
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);
    }

    public function unenrollStudent(Classroom $classroom, $studentId)
    {
        return $classroom->enrolledStudents()->updateExistingPivot($studentId, [
            'status' => 'dropped',
            'dropped_at' => now(),
        ]);
    }

    private function generateUniqueRoomCode()
    {
        do {
            $code = Str::random(6);
        } while (Classroom::where('room_code', $code)->exists());

        return $code;
    }
}