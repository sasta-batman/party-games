'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GameProps } from '../types';

interface Song {
  id: number;
  name: string;
  hint: string;
  category: string;
}

export default function HumTheSongGame({ onBackHome }: GameProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [category, setCategory] = useState('english');

  useEffect(() => {
    async function fetchSongs() {
      const { data, error } = await supabase.from('hum_the_song').select('*').eq('category', category);
      if (error) {
        console.log('error', error);
      } else {
        setSongs(data as Song[]);
        setCurrentSong(null);
      }
    }
    fetchSongs();
  }, [category]);

  const getNextSong = () => {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSong(songs[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <button
        onClick={onBackHome}
        className="absolute top-4 left-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-8">Hum The Song</h1>
      
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8">
        {['english', 'hindi'].map((cat) => (
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
        {currentSong ? (
          <div>
            <h2 className="text-3xl font-mono text-yellow-400 mb-2">
              {currentSong.name}
            </h2>
            <p className="text-slate-400 italic">Hint: {currentSong.hint}</p>
          </div>
        ) : (
          <p className="text-slate-400">Ready to play?</p>
        )}
      </div>

      <button 
        onClick={getNextSong}
        className="mt-8 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition"
      >
        {currentSong ? "Next Song" : "Start Game"}
      </button>
    </div>
  );
}
