<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\Quiz;
use App\Models\Answer;
use App\Models\Classroom;
use App\Models\EnrolledStudent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;



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
    public function getQuizzesByClassroomStudent($classroom_id)
    {
        // Get the current authenticated user's ID
        $user_id = Auth::id();

        // Fetch quizzes by classroom_id
        $quizzes = Quiz::where('classroom_id', $classroom_id)->get();

        $processedQuizzes = $quizzes->map(function ($quiz) use ($user_id) {
            $questions = json_decode($quiz->questions, true);
            $processedQuestions = array_map(function ($question) {
                // Base question structure
                $processedQuestion = [
                    'question' => $question['question']
                ];

                // Only add options if they exist
                if (isset($question['options'])) {
                    $processedQuestion['options'] = $question['options'];
                }

                return $processedQuestion;
            }, $questions);

            $quiz->questions = json_encode($processedQuestions);

            // Check if the user has answered this quiz
            $answer = Answer::where('quiz_id', $quiz->id)
                ->where('user_id', $user_id)
                ->first();

            $quiz->has_answered = !is_null($answer);

            if ($quiz->has_answered) {
                $quiz->score = $answer->score;
                $quiz->correct = $answer->correct;
                $quiz->incorrect = $answer->incorrect;
                $quiz->total_questions = $answer->total_questions;
            } else {
                $quiz->score = null;
                $quiz->correct = null;
                $quiz->incorrect = null;
                $quiz->total_questions = null;
            }

            return $quiz;
        });

        // Return processed quizzes as a JSON response
        return response()->json([
            'message' => 'Quizzes fetched successfully!',
            'quizzes' => $processedQuizzes
        ], 200);
    }

    public function getStudentAnalytics($user_id, $classroom_id)
    {
        // Fetch quizzes by classroom_id
        $quizzes = Quiz::where('classroom_id', $classroom_id)->get();

        $Quizzes = $quizzes->map(function ($quiz) use ($user_id) {
            $answer = Answer::where('quiz_id', $quiz->id)
                ->where('user_id', $user_id)
                ->first();

            $quiz->has_answered = !is_null($answer);

            if ($quiz->has_answered) {
                $quiz->score = $answer->score;
                $quiz->correct = $answer->correct;
                $quiz->incorrect = $answer->incorrect;
                $quiz->total_questions = $answer->total_questions;
            } else {
                $quiz->score = null;
                $quiz->correct = null;
                $quiz->incorrect = null;
                $quiz->total_questions = null;
            }

            return $quiz;
        });

        // Calculate analytics
        $analytics = [
            'total_quizzes' => $quizzes->count(),
            'completed_quizzes' => $Quizzes->filter(function ($quiz) {
                return $quiz->has_answered;
            })->count(),
            'pending_quizzes' => $Quizzes->filter(function ($quiz) {
                return !$quiz->has_answered && now()->isBefore($quiz->end_time);
            })->count(),
            'missed_quizzes' => $Quizzes->filter(function ($quiz) {
                return !$quiz->has_answered && now()->isAfter($quiz->end_time);
            })->count(),
            'average_score' => $Quizzes->filter(function ($quiz) {
                return $quiz->has_answered;
            })->avg('score') ?? 0,
            'total_correct_answers' => $Quizzes->sum('correct') ?? 0,
            'total_incorrect_answers' => $Quizzes->sum('incorrect') ?? 0,
            'performance_over_time' => $Quizzes->filter(function ($quiz) {
                return $quiz->has_answered;
            })->map(function ($quiz) {
                return [
                    'quiz_id' => $quiz->id,
                    'title' => $quiz->title,
                    'score' => $quiz->score,
                    'date' => $quiz->created_at
                ];
            })->values()
        ];

        // Get student info
        $student = User::find($user_id);

        return response()->json([
            'message' => 'Data fetched successfully!',
            'quizzes' => $Quizzes,
            'analytics' => $analytics,
            'student' => [
                'id' => $student->id,
                'name' => $student->first_name . ' ' . $student->last_name,
                'email' => $student->email
            ]
        ], 200);
    }
    public function getAllStudentAnalytics($user_id)
    {
        try {
            // Get student info
            $student = User::find($user_id);
            if (!$student) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            // Get all enrolled classrooms with subjects
            $enrolledClassrooms = Classroom::with('subject')
                ->whereIn('id', function ($query) use ($user_id) {
                    $query->select('classroom_id')
                        ->from('enrolled_students')
                        ->where('student_id', $user_id)
                        ->where('status', 'enrolled');
                })->get();

            // Get all quizzes for these classrooms
            $quizzes = Quiz::whereIn('classroom_id', $enrolledClassrooms->pluck('id'))
                ->get();

            $processedQuizzes = $quizzes->map(function ($quiz) use ($user_id, $enrolledClassrooms) {
                // Get answer for this quiz if exists
                $answer = Answer::where('quiz_id', $quiz->id)
                    ->where('user_id', $user_id)
                    ->first();

                $classroom = $enrolledClassrooms->find($quiz->classroom_id);

                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'start_time' => $quiz->start_time,
                    'end_time' => $quiz->end_time,
                    'classroom_id' => $quiz->classroom_id,
                    'classroom_name' => $classroom->name,
                    'subject_name' => $classroom->subject->name,
                    'has_answered' => !is_null($answer),
                    'score' => $answer ? $answer->score : null,
                    'correct' => $answer ? $answer->correct : null,
                    'incorrect' => $answer ? $answer->incorrect : null,
                    'total_questions' => $answer ? $answer->total_questions : null
                ];
            });

            $activeQuizzes = $quizzes->filter(function ($quiz) use ($user_id, $enrolledClassrooms) {
                // Only include quizzes that haven't reached deadline
                return now()->isBefore($quiz->end_time);
            })->map(function ($quiz) use ($user_id, $enrolledClassrooms) {
                // Get answer for this quiz if exists
                $answer = Answer::where('quiz_id', $quiz->id)
                    ->where('user_id', $user_id)
                    ->first();

                $classroom = $enrolledClassrooms->find($quiz->classroom_id);

                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'start_time' => $quiz->start_time,
                    'end_time' => $quiz->end_time,
                    'classroom_id' => $quiz->classroom_id,
                    'classroom_name' => $classroom->name,
                    'subject_name' => $classroom->subject->name,
                    'has_answered' => !is_null($answer),
                    'score' => $answer ? $answer->score : null,
                    'correct' => $answer ? $answer->correct : null,
                    'incorrect' => $answer ? $answer->incorrect : null,
                    'total_questions' => $answer ? $answer->total_questions : null
                ];
            });

            // Calculate analytics
            $analytics = [
                'total_quizzes' => $quizzes->count(),
                'completed_quizzes' => $processedQuizzes->where('has_answered', true)->count(),
                'pending_quizzes' => $processedQuizzes
                    ->where('has_answered', false)
                    ->filter(function ($quiz) {
                        return now()->isBefore($quiz['end_time']);
                    })->count(),
                'missed_quizzes' => $processedQuizzes
                    ->where('has_answered', false)
                    ->filter(function ($quiz) {
                        return now()->isAfter($quiz['end_time']);
                    })->count(),
                'average_score' => $processedQuizzes->where('has_answered', true)->avg('score') ?? 0,

                // Performance over time
                'performance_over_time' => $enrolledClassrooms->map(function ($classroom) use ($user_id) {
                    // Get average score for this classroom
                    $averageScore = DB::table('answers')
                        ->join('quizzes', 'answers.quiz_id', '=', 'quizzes.id')
                        ->where('quizzes.classroom_id', $classroom->id)
                        ->where('answers.user_id', $user_id)
                        ->where('quizzes.end_time', '<', now()) // Only include past quizzes
                        ->avg('answers.score');

                    // Get completion stats
                    $completedQuizzes = DB::table('answers')
                        ->join('quizzes', 'answers.quiz_id', '=', 'quizzes.id')
                        ->where('quizzes.classroom_id', $classroom->id)
                        ->where('answers.user_id', $user_id)
                        ->count();

                    $totalQuizzes = DB::table('quizzes')
                        ->where('classroom_id', $classroom->id)
                        ->where('end_time', '<', now())
                        ->count();

                    return [
                        'classroom_id' => $classroom->id,
                        'classroom_name' => $classroom->name,
                        'subject_name' => $classroom->subject->name,
                        'average_score' => round($averageScore ?? 0, 2),
                        'completed_quizzes' => $completedQuizzes,
                        'total_quizzes' => $totalQuizzes,
                        'completion_rate' => $totalQuizzes > 0
                            ? round(($completedQuizzes / $totalQuizzes) * 100, 2)
                            : 0
                    ];
                })->values(),

                // Classroom-specific analytics
                'classroom_analytics' => $enrolledClassrooms->map(function ($classroom) use ($processedQuizzes) {
                    $classroomQuizzes = collect($processedQuizzes)
                        ->where('classroom_id', $classroom->id);

                    return [
                        'classroom_id' => $classroom->id,
                        'classroom_name' => $classroom->name,
                        'subject_name' => $classroom->subject->name,
                        'total_quizzes' => $classroomQuizzes->count(),
                        'completed_quizzes' => $classroomQuizzes->where('has_answered', true)->count(),
                        'pending_quizzes' => $classroomQuizzes
                            ->where('has_answered', false)
                            ->filter(fn($q) => now()->isBefore($q['end_time']))
                            ->count(),
                        'missed_quizzes' => $classroomQuizzes
                            ->where('has_answered', false)
                            ->filter(fn($q) => now()->isAfter($q['end_time']))
                            ->count(),
                        'average_score' => $classroomQuizzes
                            ->where('has_answered', true)
                            ->avg('score') ?? 0
                    ];
                })
            ];

            return response()->json([
                'message' => 'Data fetched successfully!',
                'quizzes' => $activeQuizzes->values(),
                'analytics' => $analytics,
                'student' => [
                    'id' => $student->id,
                    'name' => $student->first_name . ' ' . $student->last_name,
                    'email' => $student->email,
                    'gender' => $student->gender,
                    'id_number' => $student->id_number,
                    'profile_picture' => $student->profile_picture,
                    'enrolled_classrooms' => $enrolledClassrooms->count()
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in getAllStudentAnalytics: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch analytics data'], 500);
        }
    }


    public function TeacherAnalytics()
    {
        $teacher = Auth::user();
    
        // First check if teacher has any classrooms
        $classrooms = Classroom::where('teacher_id', $teacher->id)
            ->with(['subject', 'enrolledStudents', 'quizzes', 'quizzes.answers'])
            ->withCount('enrolledStudents')
            ->get();
    
        // If no classrooms exist, return early with empty/default values
        if ($classrooms->isEmpty()) {
            return Inertia::render('teacher/Dashboard', [
                'classrooms' => [],
                'recentQuizzes' => [],
                'studentStats' => [
                    'total' => 0,
                    'averageScore' => 0,
                    'totalActiveQuizzes' => 0
                ]
            ]);
        }
    
        // Process existing classrooms
        $classrooms = $classrooms->map(function($classroom) {
            $totalQuizzes = $classroom->quizzes->count();
            
            // Calculate completion rate safely
            $completedQuizzes = $classroom->quizzes->filter(function($quiz) {
                return $quiz->answers->isNotEmpty();
            })->count();
            
            $classroom->completion_rate = $totalQuizzes > 0 
                ? ($completedQuizzes / $totalQuizzes) * 100 
                : 0;
    
            // Calculate average score safely
            $scores = $classroom->quizzes->flatMap(function($quiz) {
                return $quiz->answers->filter(function($answer) {
                    return !is_null($answer->score);
                })->pluck('score');
            });
            
            $classroom->average_score = $scores->isNotEmpty() ? $scores->avg() : 0;
    
            return $classroom;
        });
    
        // Safely get recent quizzes
        $recentQuizzes = Quiz::whereIn('classroom_id', $classrooms->pluck('id'))
            ->with('class:id,name')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
    
        // Calculate student stats safely
        $studentStats = [
            'total' => $classrooms->sum('enrolled_students_count') ?? 0,
            'averageScore' => $classrooms->avg('average_score') ?? 0,
            'totalActiveQuizzes' => Quiz::whereIn('classroom_id', $classrooms->pluck('id'))
                ->where('end_time', '>', now())
                ->count() ?? 0
        ];
    
        return Inertia::render('teacher/Dashboard', [
            'classrooms' => $classrooms,
            'recentQuizzes' => $recentQuizzes,
            'studentStats' => $studentStats
        ]);
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
            'showAnswer' => 'required|boolean',
            // Ensure end_time is after or equal to start_time
        ]);

        $start_time = Carbon::parse($request->start_time, 'Asia/Manila');
        $end_time = Carbon::parse($request->end_time, 'Asia/Manila');

        // Create the new quiz
        $quiz = Quiz::create([
            'title' => $request->title,
            'classroom_id' => $request->classroom_id,
            'questions' => $request->questions, // Store questions in JSON format
            'learning_materials' => $request->learning_materials,
            'start_time' => $start_time, // Store start_time
            'end_time' =>  $end_time, // Store end_time
            'time_limit' => $request->time_limit, // Store time limit in minutes
            'submitted_count' => 0, 
            'showAnswer' => $request->showAnswer,
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Quiz created successfully!',
            'quiz' => $quiz
        ], 201);  // Status code 201 for resource creation
    }

    public function generateQuizContent(Request $request)
    {

        Log::info('API Configuration:', [
            'API_URL' => env('AI_GENERATIVE_API_URL'),
            'API_KEY_EXISTS' => !empty(env('AI_API_KEY')),
            'SERVER_ENV' => env('APP_ENV')
        ]);

        $request->validate([
            'topic' => 'required|string',
            'numQuestions' => 'required|integer|min:1|max:100',
            'quizType' => 'required|string|in:multiple_choice,true_false,fill_in_blank,mixed'
        ]);

        $topic = $request->input('topic');
        $numQuestions = $request->input('numQuestions');
        $quizType = $request->input('quizType');

        $prompt = $this->buildPrompt($topic, $numQuestions, $quizType);

        $response = Http::withOptions([
            'verify' => false,
        ])->post(env('AI_GENERATIVE_API_URL') . '?key=' . env('AI_API_KEY'), [
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
    public function getClassroomRankings($classroom_id)
    {
        $user = Auth::user();
        $role = $user->role;
        $now = now();

        $totalQuizzes = Quiz::where('classroom_id', $classroom_id)->count();

        if ($totalQuizzes === 0) {
            return response()->json([
                'message' => 'No quizzes found in this classroom',
                'rankings' => []
            ]);
        }

        // Base query
        $query = DB::table('answers')
            ->join('quizzes', 'answers.quiz_id', '=', 'quizzes.id')
            ->join('users', 'answers.user_id', '=', 'users.id')
            ->where('quizzes.classroom_id', $classroom_id);

        // If user is a student, only include scores from quizzes past their deadline
        if ($role === 'student') {
            $query->where('quizzes.end_time', '<', $now);
        }

        // Get student rankings
        $rankings = $query->select(
            'users.id',
            'users.first_name',
            'users.last_name',
            DB::raw('COUNT(answers.id) as quizzes_taken'),
            DB::raw('AVG(answers.score) as average_score'),
            DB::raw('SUM(answers.correct) as total_correct'),
            DB::raw('SUM(answers.incorrect) as total_incorrect')
        )
            ->groupBy('users.id', 'users.first_name', 'users.last_name')
            ->orderByDesc('average_score')
            ->get()
            ->map(function ($student) use ($totalQuizzes) {
                return [
                    'id' => $student->id,
                    'name' => $student->first_name . " " . $student->last_name,
                    'quizzes_taken' => $student->quizzes_taken,
                    'quizzes_missed' => $totalQuizzes - $student->quizzes_taken,
                    'average_score' => round($student->average_score, 2),
                    'total_correct' => $student->total_correct,
                    'total_incorrect' => $student->total_incorrect,
                    'completion_rate' => round(($student->quizzes_taken / $totalQuizzes) * 100, 2)
                ];
            });

        // For students, we should also adjust total_quizzes to only count ended quizzes
        if ($role === 'student') {
            $totalQuizzes = Quiz::where('classroom_id', $classroom_id)
                ->where('end_time', '<', $now)
                ->count();
        }

        return response()->json([
            'message' => 'Rankings fetched successfully',
            'total_quizzes' => $totalQuizzes,
            'rankings' => $rankings
        ]);
    }

    public function getQuizRankings($quiz_id)
    {
        $quiz = Quiz::findOrFail($quiz_id);

        $rankings = DB::table('answers')
            ->join('users', 'answers.user_id', '=', 'users.id')
            ->where('answers.quiz_id', $quiz_id)
            ->select(
                'users.id',
                'users.first_name',
                'answers.score',
                'answers.correct',
                'answers.incorrect',
                'answers.total_questions',
            )
            ->orderByDesc('answers.score')
            ->get()
            ->map(function ($student, $index) {
                return [
                    'rank' => $index + 1,
                    'id' => $student->id,
                    'name' => $student->first_name,
                    'score' => $student->score,
                    'correct' => $student->correct,
                    'incorrect' => $student->incorrect,
                    'total_questions' => $student->total_questions,
                ];
            });

        return response()->json([
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'submitted_count' => $quiz->submitted_count,
            ],
            'rankings' => $rankings
        ]);
    }
    public function getClassroomScores($classroom_id)
    {
        // Get all quizzes for the classroom
        $quizzes = Quiz::where('classroom_id', $classroom_id)
            ->select('id', 'title', 'created_at')
            ->orderBy('created_at')
            ->get();

        if ($quizzes->isEmpty()) {
            return response()->json([
                'message' => 'No quizzes found in this classroom',
                'data' => []
            ], 404);
        }

        // Get all enrolled students in the classroom
        $enrolledStudents = EnrolledStudent::where('classroom_id', $classroom_id)
            ->whereIn('status', ['enrolled']) 
            ->whereNull('dropped_at')
            ->join('users', 'enrolled_students.student_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.first_name',
                'users.last_name',
                'enrolled_students.status',
                'enrolled_students.enrolled_at',
                'enrolled_students.completed_at'
            )
            ->get();
         
            // return response()->json([
            //     'message' => 'No enrolled students found in this classroom',
            //     'data' => [$enrolledStudents]
            // ], 404);

        if ($enrolledStudents->isEmpty()) {
            return response()->json([
                'message' => 'No enrolled students found in this classroom',
                'data' => []
            ], 404);
        }

        // Get all answers for all quizzes in this classroom
        $answers = Answer::whereIn('quiz_id', $quizzes->pluck('id'))
            ->whereIn('user_id', $enrolledStudents->pluck('id'))
            ->select(
                'user_id',
                'quiz_id',
                'score',
                'correct',
                'incorrect',
                'total_questions',
                'created_at'
            )
            ->get()
            ->groupBy('user_id');

        // Calculate classroom statistics
        $classroomStats = [
            'total_quizzes' => $quizzes->count(),
            'active_students' => $enrolledStudents->where('status', 'active')->count(),
            'completed_students' => $enrolledStudents->where('status', 'completed')->count(),
            'average_class_score' => 0,
            'highest_class_score' => 0,
            'lowest_class_score' => 100,
            'quiz_completion_rate' => 0
        ];

        // Prepare the data structure
        $scoreData = [];
        $totalClassScore = 0;
        $totalQuizzesTaken = 0;

        foreach ($enrolledStudents as $student) {
            $studentScores = [
                'student_id' => $student->id,
                'student_name' => $student->first_name . ' ' . $student->last_name,
                'enrollment_status' => $student->status,
                'enrolled_at' => $student->enrolled_at,
                'completed_at' => $student->completed_at,
                'quiz_scores' => [],
                'average_score' => 0,
                'total_correct' => 0,
                'total_incorrect' => 0,
                'quizzes_taken' => 0,
                'last_quiz_taken' => null
            ];

            $totalScore = 0;
            $studentAnswers = $answers->get($student->id, collect());

            foreach ($quizzes as $quiz) {
                $answer = $studentAnswers->firstWhere('quiz_id', $quiz->id);

                $quizScore = [
                    'quiz_id' => $quiz->id,
                    'quiz_title' => $quiz->title,
                    'score' => $answer ? $answer->score : null,
                    'correct' => $answer ? $answer->correct : null,
                    'incorrect' => $answer ? $answer->incorrect : null,
                    'total_questions' => $quiz->total_questions,
                    'status' => $answer ? 'completed' : 'not_attempted',
                    'submitted_at' => $answer ? $answer->created_at : null
                ];

                if ($answer) {
                    $studentScores['quizzes_taken']++;
                    $totalScore += $answer->score;
                    $studentScores['total_correct'] += $answer->correct;
                    $studentScores['total_incorrect'] += $answer->incorrect;
                    
                    // Update last quiz taken
                    if (!$studentScores['last_quiz_taken'] || 
                        $answer->created_at > $studentScores['last_quiz_taken']) {
                        $studentScores['last_quiz_taken'] = $answer->created_at;
                    }
                }

                $studentScores['quiz_scores'][] = $quizScore;
            }

            // Calculate student's average score
            $studentScores['average_score'] = $studentScores['quizzes_taken'] > 0
                ? round($totalScore / $studentScores['quizzes_taken'], 2)
                : 0;

            // Calculate completion rate
            $studentScores['completion_rate'] = round(
                ($studentScores['quizzes_taken'] / $quizzes->count()) * 100,
                2
            );

            // Update classroom statistics
            $totalClassScore += $studentScores['average_score'];
            $totalQuizzesTaken += $studentScores['quizzes_taken'];
            $classroomStats['highest_class_score'] = max(
                $classroomStats['highest_class_score'],
                $studentScores['average_score']
            );
            $classroomStats['lowest_class_score'] = min(
                $classroomStats['lowest_class_score'],
                $studentScores['average_score'] ?: 100
            );

            $scoreData[] = $studentScores;
        }

        // Calculate final classroom statistics
        $totalPossibleQuizzes = $quizzes->count() * $enrolledStudents->count();
        $classroomStats['average_class_score'] = round(
            $totalClassScore / $enrolledStudents->count(),
            2
        );
        $classroomStats['quiz_completion_rate'] = round(
            ($totalQuizzesTaken / $totalPossibleQuizzes) * 100,
            2
        );

        // Sort by average score (descending)
        usort($scoreData, function ($a, $b) {
            return $b['average_score'] <=> $a['average_score'];
        });

        // Add rankings
        foreach ($scoreData as $index => $data) {
            $scoreData[$index]['rank'] = $index + 1;
        }

        return response()->json([
            'message' => 'Classroom scores retrieved successfully',
            'data' => [
                'classroom_stats' => $classroomStats,
                'quizzes' => $quizzes->map(function ($quiz) {
                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'total_questions' => $quiz->total_questions,
                        'created_at' => $quiz->created_at
                    ];
                }),
                'student_scores' => $scoreData
            ]
        ]);
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

        $promptTypeInstructions = match ($quizType) {
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
