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
  const [isAnimating, setIsAnimating] = useState(false);

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
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(songs[randomIndex]);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-900 p-4 sm:pt-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <button
        onClick={onBackHome}
        className="sm:absolute sm:top-6 sm:left-6 bg-white/80 hover:bg-white px-5 py-2 rounded-lg transition-all duration-300 border border-slate-200 text-slate-700 z-10"
      >
        ← Back
      </button>

      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Hum The Song</h1>
        <p className="text-slate-600 text-base sm:text-lg">Hum the melody and let your team guess the song!</p>
      </div>
      
      {/* Category Toggle */}
      <div className="flex gap-4 mb-12 z-10">
        {['english', 'hindi'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-3 rounded-full capitalize font-semibold transition-all duration-300 backdrop-blur-sm border-2 ${
              category === cat 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-lg shadow-pink-500/50' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className={`relative w-full max-w-md transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl blur-xl opacity-12"></div>
        <div className="relative bg-white p-12 rounded-3xl shadow-lg border border-slate-200 text-center">
          {currentSong ? (
            <div className="space-y-6">
              <div className="text-4xl sm:text-6xl font-black text-transparent bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text">
                {currentSong.name}
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto rounded-full"></div>
              <p className="text-slate-600 text-lg italic font-light">🎵 {currentSong.hint}</p>
            </div>
          ) : (
            <div className="py-8">
              <p className="text-3xl font-light text-slate-700">Ready to play?</p>
              <p className="text-slate-600 text-sm mt-2">Click "Start Game" to get started!</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={getNextSong}
        className="mt-12 z-10 relative bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-200 text-white"
      >
        {currentSong ? "🎵 Next Song" : "▶️ Start Game"}
      </button>
    </div>
  );
}
