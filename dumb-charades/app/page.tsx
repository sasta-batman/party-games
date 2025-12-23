'use client';

import { useState } from 'react';
import DumbCharadesGame from './games/dumb-charades/page';
import GuessThePhraseGame from './games/guess-phrase/page';
import HumTheSongGame from './games/hum-the-song/page';
import { getAllGames } from './games/registry';

type CurrentPage = 'home' | 'dumb-charades' | 'guess-phrase' | 'hum-the-song';
function HomePage({ onSelectGame }: { onSelectGame: (game: CurrentPage) => void }) {
  const games = getAllGames();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-900 p-4">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="text-center mb-16 z-10">
        <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">Party Games</h1>
        <p className="text-xl text-slate-600 font-light">Have fun with your friends and family</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl z-10">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id as CurrentPage)}
            className={`group relative bg-gradient-to-br ${game.color.from} ${game.color.to} p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl overflow-hidden`}
          >
            {/* Card shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">{game.title}</h2>
              <p className={`${game.textColor} text-base font-medium drop-shadow`}>{game.description}</p>
            </div>
          </button>
        ))}
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
      {currentPage === 'dumb-charades' && <DumbCharadesGame onBackHome={handleBackHome} />}
      {currentPage === 'guess-phrase' && <GuessThePhraseGame onBackHome={handleBackHome} />}
      {currentPage === 'hum-the-song' && <HumTheSongGame onBackHome={handleBackHome} />}
    </>
  );
}