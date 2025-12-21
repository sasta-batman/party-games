'use client';

import { useEffect, useState } from 'react';
import { GameProps } from '../types';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question: string;
  answer: string;
}

export function GuessThePhraseGame({ onBackHome }: GameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('guess_the_phrase')
          .select('id, question, answer');

        if (error) {
          setError('Failed to load questions');
          console.error('Supabase error:', error);
          return;
        }

        if (data && data.length > 0) {
          setQuestions(data);
          getNextQuestion(data);
        } else {
          setError('No questions found');
        }
      } catch (err) {
        setError('An error occurred while fetching questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const getNextQuestion = (questionList: Question[]) => {
    if (questionList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * questionList.length);
    setCurrentQuestion(questionList[randomIndex]);
    setQuestionCount(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentQuestion) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        setUserAnswer('');
        setFeedback(null);
        setShowAnswer(false);
        getNextQuestion(questions);
      }, 1500);
    } else {
      setFeedback('wrong');
    }
  };

  const handleSkip = () => {
    setUserAnswer('');
    setFeedback(null);
    setShowAnswer(false);
    getNextQuestion(questions);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <p className="text-2xl">Loading questions...</p>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <button
          onClick={onBackHome}
          className="absolute top-4 left-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Guess The Phrase</h1>
          <p className="text-2xl text-red-500">{error || 'No questions available'}</p>
        </div>
      </div>
    );
  }

  const isGameOver = questionCount > 0 && feedback === 'correct' && questions.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <button
        onClick={onBackHome}
        className="absolute top-4 left-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
      >
        ← Back
      </button>

      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-8 text-center">Guess The Phrase</h1>

        {!isGameOver ? (
          <>
            <div className="mb-8 text-center">
              <p className="text-slate-400 mb-2">
                Question #{questionCount}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-8 mb-8">
              <div
                className="text-3xl font-bold text-center mb-8"
                dangerouslySetInnerHTML={{ __html: currentQuestion?.question || '' }}
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    disabled={feedback === 'correct'}
                    autoFocus
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-4 rounded-lg text-center text-2xl font-bold ${
                      feedback === 'correct'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
                  </div>
                )}

                {showAnswer && (
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <p className="text-slate-300">
                      Answer: <span className="text-yellow-400 font-bold text-lg">{currentQuestion?.answer}</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="submit"
                    disabled={feedback === 'correct' || !userAnswer.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-6 py-3 rounded-lg font-bold text-lg transition"
                  >
                    Submit Answer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAnswer(!showAnswer)}
                    disabled={feedback === 'correct'}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 px-6 py-3 rounded-lg font-bold text-lg transition"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={feedback === 'correct'}
                  className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 px-6 py-3 rounded-lg font-bold text-lg transition"
                >
                  Skip Question
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <h2 className="text-4xl font-bold mb-4 text-green-500">🎉 Great Job!</h2>
            <p className="text-xl text-slate-300 mb-6">
              You answered {questionCount} questions!
            </p>
            <button
              onClick={onBackHome}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold text-lg transition"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
