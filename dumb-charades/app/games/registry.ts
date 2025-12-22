import { GameConfig } from './types';

export const GAMES: Record<string, GameConfig> = {
  'dumb-charades': {
    id: 'dumb-charades',
    title: 'Dumb Charades',
    description: 'Act out movies and guess with your team!',
    color: {
      from: 'from-blue-600',
      to: 'to-blue-800',
      hover_from: 'hover:from-blue-500',
      hover_to: 'hover:to-blue-700',
    },
    textColor: 'text-blue-100',
  },
  'guess-phrase': {
    id: 'guess-phrase',
    title: 'Guess The Phrase',
    description: 'Guess phrases based on clues provided!',
    color: {
      from: 'from-purple-600',
      to: 'to-purple-800',
      hover_from: 'hover:from-purple-500',
      hover_to: 'hover:to-purple-700',
    },
    textColor: 'text-purple-100',
  },
  'hum-the-song': {
    id: 'hum-the-song',
    title: 'Hum The Song',
    description: 'Hum popular songs and let your team guess them!',
    color: {
      from: 'from-green-600',
      to: 'to-green-800',
      hover_from: 'hover:from-green-500',
      hover_to: 'hover:to-green-700',
    },
    textColor: 'text-green-100',
  },
};

export const getGameConfig = (gameId: string): GameConfig | null => {
  return GAMES[gameId] || null;
};

export const getAllGames = (): GameConfig[] => {
  return Object.values(GAMES);
};
