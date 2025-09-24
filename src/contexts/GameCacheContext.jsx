import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameCacheContext = createContext();

export const useGameCache = () => {
  const context = useContext(GameCacheContext);
  if (!context) {
    throw new Error('useGameCache must be used within a GameCacheProvider');
  }
  return context;
};

export const GameCacheProvider = ({ children }) => {
  const [cache, setCache] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cache from localStorage on mount
  useEffect(() => {
    const loadCache = () => {
      try {
        const savedCache = localStorage.getItem('filmdle-game-cache');
        console.log('Raw localStorage data:', savedCache);
        if (savedCache) {
          const parsedCache = JSON.parse(savedCache);
          setCache(parsedCache);
          console.log('Loaded game cache from localStorage:', parsedCache);
        } else {
          console.log('No data found in localStorage');
          setCache({});
        }
      } catch (error) {
        console.error('Error loading game cache from localStorage:', error);
        setCache({});
      } finally {
        setIsLoaded(true);
      }
    };

    // Use a small timeout to ensure localStorage is available
    const timeoutId = setTimeout(loadCache, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    // Only save if we've loaded the initial cache to avoid overwriting with empty data
    if (!isLoaded) return;
    
    try {
      const cacheString = JSON.stringify(cache);
      localStorage.setItem('filmdle-game-cache', cacheString);
      console.log('Saved game cache to localStorage:', cache);
      console.log('Cache string length:', cacheString.length);
    } catch (error) {
      console.error('Error saving game cache to localStorage:', error);
    }
  }, [cache, isLoaded]);

  // Get current day's game data
  const getCurrentGameData = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const gameData = cache[today];
    
    console.log("Getting current game data for", today, ":", gameData);
    
    // Return game data if it exists and has either a correctMovieId or guesses
    if (gameData && (gameData.correctMovieId || (gameData.guesses && gameData.guesses.length > 0))) {
      console.log("Valid game data found:", gameData);
      return gameData;
    }
    
    console.log("No valid game data found");
    return null;
  }, [cache]);

  // Save current day's game data
  const saveCurrentGameData = useCallback((gameData) => {
    const today = new Date().toISOString().split('T')[0];
    setCache(prevCache => ({
      ...prevCache,
      [today]: {
        ...prevCache[today],
        ...gameData,
        lastUpdated: new Date().toISOString()
      }
    }));
  }, []);

  // Clear all cache (for new game)
  const clearAllCache = useCallback(() => {
    setCache({});
  }, []);

  // Save a movie guess for current day
  const saveMovieGuess = useCallback((movieData) => {
    const today = new Date().toISOString().split('T')[0];
    console.log("Saving movie guess to cache:", movieData);
    setCache(prevCache => {
      const currentGame = prevCache[today] || { guesses: [], finished: false, gaveUp: false };
      const updatedGuesses = [movieData, ...currentGame.guesses];
      
      const newCache = {
        ...prevCache,
        [today]: {
          ...currentGame,
          guesses: updatedGuesses,
          lastUpdated: new Date().toISOString()
        }
      };
      
      console.log("Updated cache:", newCache);
      return newCache;
    });
  }, []);

  // Mark current game as finished
  const markGameFinished = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setCache(prevCache => ({
      ...prevCache,
      [today]: {
        ...prevCache[today],
        finished: true,
        lastUpdated: new Date().toISOString()
      }
    }));
  }, []);

  // Mark current game as gave up
  const markGameGaveUp = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setCache(prevCache => ({
      ...prevCache,
      [today]: {
        ...prevCache[today],
        gaveUp: true,
        lastUpdated: new Date().toISOString()
      }
    }));
  }, []);

  // Check if current day's game exists in cache
  const hasCurrentGameData = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const gameData = cache[today];
    return gameData && (gameData.correctMovieId || (gameData.guesses && gameData.guesses.length > 0));
  }, [cache]);

  const value = {
    cache,
    isLoaded,
    getCurrentGameData,
    saveCurrentGameData,
    saveMovieGuess,
    markGameFinished,
    markGameGaveUp,
    clearAllCache,
    hasCurrentGameData
  };

  return (
    <GameCacheContext.Provider value={value}>
      {children}
    </GameCacheContext.Provider>
  );
};
