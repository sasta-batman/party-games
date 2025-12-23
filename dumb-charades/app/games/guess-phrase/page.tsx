// ...existing code...
'use client';

import { useEffect, useState } from 'react';
import { GameProps } from '../types';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question: string;
  answer: string;
}

export default function GuessThePhraseGame({ onBackHome }: GameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);

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
      setScore(prev => prev + 1);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-900">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-xl opacity-10"></div>
          <p className="relative text-3xl font-light text-slate-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-900 p-4">
        <button
          onClick={onBackHome}
          className="absolute top-6 left-6 bg-white/80 hover:bg-white px-5 py-2 rounded-lg transition-all duration-300 border border-slate-200 text-slate-700 z-10"
        >
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Guess The Phrase</h1>
          <p className="text-2xl text-red-600 font-light">{error || 'No questions available'}</p>
        </div>
      </div>
    );
  }

  const isGameOver = false; // You can adjust this logic based on your game rules

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-900 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl -z-10"></div>

      <button
        onClick={onBackHome}
        className="absolute top-6 left-6 bg-white/80 hover:bg-white px-5 py-2 rounded-lg transition-all duration-300 border border-slate-200 text-slate-700 z-10"
      >
        ← Back
      </button>

      <div className="w-full max-w-2xl z-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-6xl font-black mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Guess The Phrase</h1>
            <p className="text-slate-700 text-lg">Decode the clues and find the answer!</p>
          </div>
          <div className="text-right bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <p className="text-sm text-slate-500">Questions</p>
            <p className="text-3xl font-black text-slate-900">{questionCount}</p>
            <p className="text-sm text-slate-500 mt-2">Score: <span className="text-violet-600 font-bold">{score}</span></p>
          </div>
        </div>

        {!isGameOver ? (
          <>
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl blur-xl opacity-12"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <div className="mb-8">
                  <p className="text-sm text-slate-500 text-center mb-4">Question #{questionCount}</p>
                  <div
                    className="text-3xl font-sans font-bold text-center mb-8"
                    dangerouslySetInnerHTML={{ __html: currentQuestion?.question || '' }}
                  />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-slate-200 text-lg transition-all"
                      disabled={feedback === 'correct'}
                      autoFocus
                    />
                  </div>

                  {feedback && (
                    <div
                      className={`p-5 rounded-xl text-center text-xl font-bold transition-all duration-300 border-2 ${
                        feedback === 'correct'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {feedback === 'correct' ? '✨ Correct!' : '✗ Wrong!'}
                    </div>
                  )}

                  {showAnswer && (
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 text-center">
                        Answer: <span className="text-violet-700 font-bold text-lg">{currentQuestion?.answer}</span>
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="submit"
                      disabled={feedback === 'correct' || !userAnswer.trim()}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-violet-200 disabled:shadow-none text-white"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAnswer(!showAnswer)}
                      disabled={feedback === 'correct'}
                      className="bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 px-6 py-3 rounded-xl font-bold text-lg transition-all border border-slate-200"
                    >
                      {showAnswer ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={feedback === 'correct'}
                    className="w-full bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 px-6 py-3 rounded-xl font-bold text-lg transition-all border border-slate-200"
                  >
                    Skip Question
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative bg-white rounded-3xl p-8 text-center shadow-lg border border-slate-200">
                <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">🎉 Great Job!</h2>
                <p className="text-2xl text-slate-700 mb-8 font-light">
                  You scored <span className="font-bold text-violet-600">{score}</span> out of <span className="font-bold text-violet-600">{questionCount}</span>
                </p>
                <button
                  onClick={onBackHome}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-violet-200 text-white"
                >
                  Back to Home
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ...existing code...