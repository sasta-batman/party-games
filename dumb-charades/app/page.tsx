'use client';

import { useState } from 'react';
import { DumbCharadesGame } from './games/dumb-charades/page';
import { GuessThePhraseGame } from './games/guess-phrase/page';
import { getAllGames } from './games/registry';

type CurrentPage = 'home' | 'dumb-charades' | 'guess-phrase';

function HomePage({ onSelectGame }: { onSelectGame: (game: CurrentPage) => void }) {
  const games = getAllGames();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-12">Party Games</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id as CurrentPage)}
            className={`bg-gradient-to-br ${game.color.from} ${game.color.to} ${game.color.hover_from} ${game.color.hover_to} p-8 rounded-xl shadow-lg transition transform hover:scale-105`}
          >
            <h2 className="text-3xl font-bold mb-2">{game.title}</h2>
            <p className={game.textColor}>{game.description}</p>
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
    </>
  );
}