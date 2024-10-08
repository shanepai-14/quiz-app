import React, { useState } from 'react';
import axios from 'axios';


export const useQuizGenerator = () => {
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  
    const generateQuiz = (topic, numQuestions, quizType) => {
        setLoading(true);
        setError(null);
      
        return new Promise((resolve, reject) => {
          axios.post(route('generateQuizContent'), { topic, numQuestions, quizType }, {
            headers: { 'Accept': 'application/json' },
          })
          .then((response) => {
            console.log(response.data);
            setQuizData(response.data);
            setLoading(false);
            resolve(response.data);
          })
          .catch((error) => {
            console.error('Error generating quiz:', error);
            setError('Failed to generate quiz. Please try again.');
            setLoading(false);
            reject(error);
          });
        });
      };
  
    return { generateQuiz, quizData, loading, error };
  };