import { useGameCache } from '../contexts/GameCacheContext';

// Custom hook for current day's game cache operations
export const useCurrentGameCache = () => {
  const {
    isLoaded,
    getCurrentGameData,
    saveCurrentGameData,
    saveMovieGuess,
    markGameFinished,
    markGameGaveUp,
    hasCurrentGameData,
    clearAllCache
  } = useGameCache();

  const gameData = isLoaded ? getCurrentGameData() : null;
  const isGameCached = isLoaded ? hasCurrentGameData() : false;

  const saveGuess = (movieData) => {
    saveMovieGuess(movieData);
  };

  const finishGame = () => {
    markGameFinished();
  };

  const giveUpGame = () => {
    markGameGaveUp();
  };

  const updateGameData = (updates) => {
    saveCurrentGameData(updates);
  };

  const clearCache = () => {
    clearAllCache();
  };

  return {
    gameData,
    isGameCached,
    isLoaded,
    saveGuess,
    finishGame,
    giveUpGame,
    updateGameData,
    clearCache,
    guesses: gameData?.guesses || [],
    finished: gameData?.finished || false,
    gaveUp: gameData?.gaveUp || false,
    correctMovieId: gameData?.correctMovieId || null
  };
};

// Simple hook for cache utilities
export const useCacheUtils = () => {
  const { clearAllCache } = useGameCache();

  return {
    clearCache: clearAllCache
  };
};
