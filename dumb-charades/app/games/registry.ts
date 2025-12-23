import { GameConfig } from './types';

export const GAMES: Record<string, GameConfig> = {
  'dumb-charades': {
    id: 'dumb-charades',
    title: 'Dumb Charades',
    description: 'Act out movies and guess with your team!',
    color: {
      from: 'from-cyan-500',
      to: 'to-blue-600',
      hover_from: 'hover:from-cyan-400',
      hover_to: 'hover:to-blue-500',
    },
    textColor: 'text-white',
  },
  'guess-phrase': {
    id: 'guess-phrase',
    title: 'Guess The Phrase',
    description: 'Guess phrases based on clues provided!',
    color: {
      from: 'from-violet-500',
      to: 'to-purple-600',
      hover_from: 'hover:from-violet-400',
      hover_to: 'hover:to-purple-500',
    },
    textColor: 'text-white',
  },
  'hum-the-song': {
    id: 'hum-the-song',
    title: 'Hum The Song',
    description: 'Hum popular songs and let your team guess them!',
    color: {
      from: 'from-pink-500',
      to: 'to-rose-600',
      hover_from: 'hover:from-pink-400',
      hover_to: 'hover:to-rose-500',
    },
    textColor: 'text-white',
  },
};

export const getGameConfig = (gameId: string): GameConfig | null => {
  return GAMES[gameId] || null;
};

export const getAllGames = (): GameConfig[] => {
  return Object.values(GAMES);
};
