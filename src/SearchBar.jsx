import React, { useState, useRef, useEffect } from 'react';
import { searchMovies, fetchMovie } from './lib/tmdb.js';

export const SearchBar = ({ handleMovieSelect }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Reset selected index when movies change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [movies]);

  // Keep input always focused
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.focus();
    }
  }, []);

  // Refocus input after any interaction
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Fetch data from API
  const fetchData = (query) => {
    setLoading(true);
    setError(null);
    searchMovies(query)
      .then(result => {
        setMovies(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setSelectedIndex(-1); // Reset selected index when input changes
    setSelectedMovieId(null); // Clear selected movie when typing
    if (value.trim()) {
      fetchData(value);
    } else {
      setMovies([]);
    }
  };

  const handleSelection = (movie) => {
    setInput(movie.title);
    setSelectedMovieId(movie.id);
    setMovies([]);
    setIsFocused(false);
    setSelectedIndex(-1);
  };

  const handleBlur = () => {
    // Don't hide suggestions on blur - keep them visible
    // The input will be refocused automatically
  };

  const handleFocus = () => {
    setIsFocused(true);
    // If there's text in the input and no movies loaded, fetch them
    if (input.trim() && movies.length === 0) {
      fetchData(input);
    }
  };

  // Get filtered and sorted movies for navigation
  const getFilteredMovies = () => {
    return movies
      .filter(movie => movie.vote_count > 250)
      .sort((a, b) => b.popularity - a.popularity);
  };

  const handleKeyDown = (e) => {
    const filteredMovies = getFilteredMovies();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredMovies.length) {
        // Select the highlighted movie
        const selectedMovie = filteredMovies[selectedIndex];
        handleSelection(selectedMovie);
      } else {
        // If no movie is highlighted, try to guess with current input
        handleGuessClick();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredMovies.length > 0) {
        setSelectedIndex(prev => 
          prev < filteredMovies.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredMovies.length > 0) {
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredMovies.length - 1
        );
      }
    } else if (e.key === 'Escape') {
      setSelectedIndex(-1);
      setMovies([]);
      setIsFocused(false);
    }
  };


  const handleGuessClick = () => {
    if (selectedMovieId) {
      fetchMovie(selectedMovieId)
        .then(movie => {
          handleMovieSelect(movie);
          setInput('');
          setSelectedMovieId(null);
          setSelectedIndex(-1);
          setMovies([]);
          // Ensure input stays focused
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);
        })
        .catch(err => {
          console.log("Movie not found");
        });
    } else {
      console.log("No movie selected");
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="input-group mt-3 mb-3">
        <input
          ref={inputRef}
          type="search"
          className="form-control rounded"
          placeholder="Search for a movie..."
          value={input}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          type="button"
          className="btn btn-danger ml-1"
          id='guess-button'
          onClick={handleGuessClick}
        >
          Guess
        </button>
      </div>

      {error && <p>Error: {error.message}</p>}

      {movies.length > 0 && (
        <ul className="suggestions-list">
          {getFilteredMovies().map((movie, index) => (
            <li
              key={movie.id}
              className={`suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
              onMouseDown={() => handleSelection(movie)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                width={50}
                height={50}
              />
              {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;