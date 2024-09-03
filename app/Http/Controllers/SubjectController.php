<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
   /**
     * Fetch subjects based on search query.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchSubjects(Request $request)
    {
        // Optionally filter by search term
        $search = $request->input('search');

        // Fetch subjects based on the search query
        $query = Subject::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        $subjects = $query->get();

        return response()->json($subjects);
    }
}
