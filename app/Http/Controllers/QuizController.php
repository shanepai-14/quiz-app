<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Quiz;
use Carbon\Carbon;
class QuizController extends Controller
{

     /**
     * Fetch all quizzes by classroom_id
     *
     * @param  int  $classroom_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getQuizzesByClassroom($classroom_id)
    {
        // Fetch quizzes by classroom_id
        $quizzes = Quiz::where('classroom_id', $classroom_id)->get();

        // Return quizzes as a JSON response
        return response()->json([
            'message' => 'Quizzes fetched successfully!',
            'quizzes' => $quizzes
        ], 200);
    }

    /**
     * Store a newly created quiz in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'title' => 'required|string|max:255',
            'classroom_id' => 'required|',
            'questions' => 'required|json', // Validate that the questions are provided in JSON format
            'learning_materials' => 'nullable|string', // Optional field for learning materials
            'start_time' => 'required|date', // Ensure it's a valid date
            'end_time' => 'required|date|after_or_equal:start_time',
            'time_limit' => 'required|integer|min:1',
             // Ensure end_time is after or equal to start_time
        ]);

        $start_time = Carbon::parse($request->start_time)->format('Y-m-d H:i:s');
        $end_time = Carbon::parse($request->end_time)->format('Y-m-d H:i:s');

        // Create the new quiz
        $quiz = Quiz::create([
            'title' => $request->title,
            'classroom_id' => $request->classroom_id,
            'questions' => $request->questions, // Store questions in JSON format
            'learning_materials' => $request->learning_materials,
            'start_time' => $start_time, // Store start_time
            'end_time' =>  $end_time, // Store end_time
            'time_limit' => $request->time_limit, // Store time limit in minutes
            'submitted_count' => 0, // Start with 0 submitted answers
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Quiz created successfully!',
            'quiz' => $quiz
        ], 201);  // Status code 201 for resource creation
    }

    public function generateQuizContent(Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:255',
            'numQuestions' => 'required|integer|min:1|max:100',
            'quizType' => 'required|string|in:multiple_choice,true_false,fill_in_blank,mixed'
        ]);

        $topic = $request->input('topic');
        $numQuestions = $request->input('numQuestions');
        $quizType = $request->input('quizType');

        $prompt = $this->buildPrompt($topic, $numQuestions, $quizType);

        $response = Http::withOptions([
            'verify' => false,
        ])->post(env('GOOGLE_GENERATIVE_API_URL') . '?key=' . env('GOOGLE_API_KEY'), [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ]
                ]
            ]
        ]);

        $generatedContent = $response->json();

        // Extract the generated quiz JSON from the API response
        $quizJson = $this->extractQuizJson($generatedContent);

        if ($quizJson) {
            return response()->json(json_decode($quizJson, true));
        } else {
            return response()->json(['error' => 'Failed to generate quiz'], 500);
        }
    }

    private function extractQuizJson($generatedContent)
    {
        // The exact path to the generated text may vary depending on the API response structure
        // Adjust this as necessary based on the actual response format
        $generatedText = $generatedContent['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if ($generatedText) {
            // Find the JSON object in the generated text
            preg_match('/\{[\s\S]*\}/', $generatedText, $matches);
            return $matches[0] ?? null;
        }

        return null;
    }
    private function buildPrompt($topic, $numQuestions, $quizType)
    {
        $promptStart = "Generate a quiz in JSON format about {$topic}. The quiz should have {$numQuestions} questions";

        $promptTypeInstructions = match($quizType) {
            'multiple_choice' => " and include only multiple-choice questions with 4 options each.",
            'true_false' => " and include only true/false questions.",
            'fill_in_blank' => " and include only fill-in-the-blank questions.",
            'mixed' => " and include a mix of multiple-choice, true/false, and fill-in-the-blank questions.",
            default => " and include a mix of question types.",
        };

        $promptStructure = "Use the following JSON structure:

            {
            \"title\": \"Quiz Title\",
            \"questions\": [
                {
                \"question\": \"Question text\",
                \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],
                \"correctAnswer\": \"Correct option\"
                },
                {
                \"question\": \"True/False statement\",
                \"options\": [\"True\", \"False\"],
                \"correctAnswer\": \"True or False\"
                },
                {
                \"question\": \"Fill in the blank: _________\",
                \"correctAnswer\": \"Correct answer\"
                }
            ]
            }

            Ensure that the JSON is valid and properly formatted. Generate the quiz now.";

                    return $promptStart . $promptTypeInstructions . "\n\n" . $promptStructure;
                }
}
