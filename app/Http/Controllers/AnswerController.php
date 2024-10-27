<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Quiz;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;


class AnswerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'submitted_answers' => 'required|array',
            // 'time_taken' => 'required|numeric'
        ]);

        $user_id = Auth::id();
        $quiz = Quiz::findOrFail($validated['quiz_id']);
        
        // $now = Carbon::now();
        // $startTime = Carbon::parse($quiz->start_time);
        // $endTime = Carbon::parse($quiz->end_time);
        
        // if ($now->lt($startTime) || $now->gt($endTime)) {
        //     return back()->with('error', 'Quiz is not currently active.');
        // }

        // Check if student has already submitted
        $existingAnswer = Answer::where('quiz_id', $quiz->id)
            ->where('user_id', $user_id)
            ->first();

        if ($existingAnswer) {
            return back()->with('error', 'You have already submitted this quiz.');
        }

        $questions = is_string($quiz->questions) ? json_decode($quiz->questions, true) : $quiz->questions;
        $scoreDetails = $this->calculateScore($validated['submitted_answers'], $questions);

        // Create the answer
        $answer = Answer::create([
            'quiz_id' => $validated['quiz_id'],
            'user_id' => $user_id,
            'submitted_answers' => $validated['submitted_answers'],
            'score' => $scoreDetails['score'],
            'correct' => $scoreDetails['correct'],
            'incorrect' => $scoreDetails['incorrect'],
            'total_questions' => $scoreDetails['total_questions'],
        ]);
        // Increment the submitted count
        $quiz->increment('submitted_count');

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'submitted_answers' => $validated['submitted_answers'],
            'totalQuestions' => $scoreDetails['total_questions'],
        ]);
    }

    public function getAnswerDetails($quiz_id, $user_id )
    {
    
    
        
        // Get the quiz and user's answer
        $quiz = Quiz::findOrFail($quiz_id);
        $answer = Answer::where('quiz_id', $quiz_id)
                       ->where('user_id', $user_id)
                       ->firstOrFail();

        // Get quiz questions and submitted answers
        $questions = json_decode($quiz->questions, true);
        $submittedAnswers = $answer->submitted_answers;

        // Build the comparison data
        $answerDetails = [];
        foreach ($questions as $index => $questionData) {
            $userAnswer = $submittedAnswers[$index] ?? 'Not answered';
            $correctAnswer = $questionData['correctAnswer'];
            $isCorrect = strcasecmp(trim($userAnswer), trim($correctAnswer)) === 0;

            $answerDetails[] = [
                'question' => $questionData['question'],
                'userAnswer' => $userAnswer,
                'correctAnswer' => $correctAnswer,
                'isCorrect' => $isCorrect
            ];
        }

        return response()->json([
            'answerDetails' => $answerDetails,
            'score' => $answer->score,
            'correct' => $answer->correct,
            'incorrect' => $answer->incorrect,
            'totalQuestions' => $answer->total_questions
        ]);
    }

    private function calculateScore(array $submittedAnswers, array $questions)
    {
        $correctCount = 0;
        $totalQuestions = count($questions);

        foreach ($questions as $index => $questionData) {
            if (isset($submittedAnswers[$index])) {
                $userAnswer = strtolower(trim($submittedAnswers[$index]));
                $correctAnswer = strtolower(trim($questionData['correctAnswer']));
                
                if ($userAnswer === $correctAnswer) {
                    $correctCount++;
                }
            }
        }

        // Calculate percentage and round to 2 decimal places
        $incorrectCount = $totalQuestions - $correctCount;
        $scorePercentage = round(($correctCount / $totalQuestions) * 100, 2);

        return [
            'score' => $scorePercentage,
            'correct' => $correctCount,
            'incorrect' => $incorrectCount,
            'total_questions' => $totalQuestions
        ];
    }
}
