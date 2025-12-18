"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// 1. Define the interface for your Movie data
interface Movie {
  id: number;
  name: string;
  hint: string;
  category: string;
}

type CurrentPage = 'home' | 'dumb-charades' | 'guess-phrase';

function HomePage({ onSelectGame }: { onSelectGame: (game: CurrentPage) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-12">Party Games</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {/* Dumb Charades */}
        <button
          onClick={() => onSelectGame('dumb-charades')}
          className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-8 rounded-xl shadow-lg transition transform hover:scale-105"
        >
          <h2 className="text-3xl font-bold mb-2">Dumb Charades</h2>
          <p className="text-blue-100">Act out movies and guess with your team!</p>
        </button>

        {/* Guess The Phrase */}
        <button
          onClick={() => onSelectGame('guess-phrase')}
          className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-8 rounded-xl shadow-lg transition transform hover:scale-105"
        >
          <h2 className="text-3xl font-bold mb-2">Guess The Phrase</h2>
          <p className="text-purple-100">Coming soon...</p>
        </button>
      </div>
    </div>
  );
}

function CharadesGame({ onBackHome }: { onBackHome: () => void }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [category, setCategory] = useState('bollywood');

  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase.from('movies').select('*').eq('category', category);
      if (error) {
        console.log('error', error);
      } else {
        setMovies(data as Movie[]);
        setCurrentMovie(null);
      }
    }
    fetchMovies();
  }, [category]);

  const getNextMovie = () => {
    if (movies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * movies.length);
    setCurrentMovie(movies[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <button
        onClick={onBackHome}
        className="absolute top-4 left-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-8">Dumb Charades</h1>
      
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8">
        {['bollywood', 'hollywood'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full capitalize transition ${
              category === cat 
                ? 'bg-yellow-500 text-slate-900 font-bold' 
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 p-10 rounded-xl shadow-2xl text-center min-w-[300px]">
        {currentMovie ? (
          <div>
            <h2 className="text-3xl font-mono text-yellow-400 mb-2">
              {currentMovie.name}
            </h2>
            <p className="text-slate-400 italic">Hint: {currentMovie.hint}</p>
          </div>
        ) : (
          <p className="text-slate-400">Ready to play?</p>
        )}
      </div>

      <button 
        onClick={getNextMovie}
        className="mt-8 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition"
      >
        {currentMovie ? "Next Movie" : "Start Game"}
      </button>
    </div>
  );
}

function GuessThePhrasePage({ onBackHome }: { onBackHome: () => void }) {
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
        <p className="text-3xl text-slate-300">🚧 Work in Progress 🚧</p>
        <p className="text-slate-400 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');

  const handleSelectGame = (game: CurrentPage) => {
    setCurrentPage(game);
  };

  const handleBackHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && <HomePage onSelectGame={handleSelectGame} />}
      {currentPage === 'dumb-charades' && <CharadesGame onBackHome={handleBackHome} />}
      {currentPage === 'guess-phrase' && <GuessThePhrasePage onBackHome={handleBackHome} />}
    </>
  );
}