"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CharadesGame() {
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);

  // 1. Fetch movies when the page loads
  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase.from('movies').select('*');
      if (error) console.log('error', error);
      else setMovies(data);
    }
    fetchMovies();
  }, []);
  // 2. Pick a random movie
  const getNextMovie = () => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    setCurrentMovie(movies[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Dumb Charades</h1>
      
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