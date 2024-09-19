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

    public function enrollStudent(Classroom $classroom, $studentId, $status)
    {
        $attributes = [
            'status' => $status,
            'updated_at' => now(),  // Always update the `updated_at` field
        ];
    
        // Set the appropriate date field based on the status
        switch ($status) {
            case 'enrolled':
                $attributes['enrolled_at'] = now();
                break;
            case 'dropped':
                $attributes['dropped_at'] = now();
                break;
            case 'completed':
                $attributes['completed_at'] = now();
                break;
            case 'pending':
                // No date is set for pending status
                break;
        }
    
        // Attach the student to the classroom with the appropriate attributes
        return $classroom->enrolledStudents()->attach($studentId, $attributes);
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