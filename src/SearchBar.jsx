import React, { useState, useRef, useEffect } from 'react';
import { searchMovies, fetchMovie } from './lib/tmdb.js';

export const SearchBar = ({ handleMovieSelect }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const searchRef = useRef(null);

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
    fetchData(value);
  };

  const handleSelection = (movie) => {
    setInput(movie.title);
    setSelectedMovieId(movie.id);
    setMovies([]);
    setIsFocused(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };


  const handleGuessClick = () => {
    if (selectedMovieId) {
      fetchMovie(selectedMovieId)
        .then(movie => {
          handleMovieSelect(movie);
          setInput('');
          setSelectedMovieId(null);
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
          type="search"
          className="form-control rounded"
          placeholder="Search for a movie..."
          value={input}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleGuessClick(e); } }}
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

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {isFocused && movies.length > 0 && (
        <ul className="suggestions-list">
          {movies
            .filter(movie => movie.vote_count > 250)
            .sort((a, b) => b.popularity - a.popularity)
            .map(movie => (
              <li
                key={movie.id}
                className="suggestion-item"
                onMouseDown={() => handleSelection(movie)}
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