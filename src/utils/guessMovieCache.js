// Utility functions for handling movie guesses with local cache (current day only)
export const saveGuessToCache = (movieData) => {
  try {
    const cacheKey = 'filmdle-game-cache';
    const today = new Date().toISOString().split('T')[0];
    const existingCache = localStorage.getItem(cacheKey);
    const cache = existingCache ? JSON.parse(existingCache) : {};
    
    const currentGame = cache[today] || { guesses: [], finished: false, gaveUp: false };
    
    // Check for duplicate guesses
    const isDuplicate = currentGame.guesses.some(guess => 
      guess.id === movieData.id || guess.title === movieData.title
    );
    
    if (isDuplicate) {
      console.log("You already guessed this movie!");
      return false;
    }
    
    // Add new guess (most recent first for proper display order)
    const updatedGuesses = [movieData, ...currentGame.guesses];
    
    cache[today] = {
      ...currentGame,
      guesses: updatedGuesses,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cache));
    console.log("Guess saved to cache:", movieData.title);
    return true;
  } catch (error) {
    console.error("Error saving guess to cache:", error);
    return false;
  }
};

export const markGameFinishedInCache = () => {
  try {
    const cacheKey = 'filmdle-game-cache';
    const today = new Date().toISOString().split('T')[0];
    const existingCache = localStorage.getItem(cacheKey);
    const cache = existingCache ? JSON.parse(existingCache) : {};
    
    if (cache[today]) {
      cache[today] = {
        ...cache[today],
        finished: true,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(cache));
      console.log("Game marked as finished in cache");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error marking game as finished in cache:", error);
    return false;
  }
};

export const markGameGaveUpInCache = () => {
  try {
    const cacheKey = 'filmdle-game-cache';
    const today = new Date().toISOString().split('T')[0];
    const existingCache = localStorage.getItem(cacheKey);
    const cache = existingCache ? JSON.parse(existingCache) : {};
    
    if (cache[today]) {
      cache[today] = {
        ...cache[today],
        gaveUp: true,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(cache));
      console.log("Game marked as gave up in cache");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error marking game as gave up in cache:", error);
    return false;
  }
};

export const getCurrentGameFromCache = () => {
  try {
    const cacheKey = 'filmdle-game-cache';
    const today = new Date().toISOString().split('T')[0];
    const existingCache = localStorage.getItem(cacheKey);
    const cache = existingCache ? JSON.parse(existingCache) : {};
    
    return cache[today] || null;
  } catch (error) {
    console.error("Error getting current game from cache:", error);
    return null;
  }
};
