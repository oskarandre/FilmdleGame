import React, { useState, useEffect, useCallback } from 'react';
import { CollectInfo } from './CollectInfo';

const compareMovies = (guessed, answer) => {
    //console.log("COMPARE MOVIES -> Guessed: ", guessed, " vs. answer: ", answer); //check if blackness comes from null

    const guessedReleaseYear = parseInt(guessed.release_date.split('-')[0], 10);
    const answerReleaseYear = parseInt(answer.release_date.split('-')[0], 10);
    let releaseDateMatch = "correct";
    if (guessedReleaseYear > answerReleaseYear) {
        releaseDateMatch = "higher";
    } else if (guessedReleaseYear < answerReleaseYear) {
        releaseDateMatch = "lower";
    }

    // Compare genre IDs
    const guessedGenreIds = guessed.genres.slice(0, 4).map(item => item.id);
    const answerGenreIds = answer.genres.slice(0, 4).map(item => item.id);
    let genreMatch = "correct";
    const guessedSet = new Set(guessedGenreIds);
    const answerSet = new Set(answerGenreIds);

    let matchCount = 0;
    for (let id of guessedSet) {
        if (answerSet.has(id)) {
            matchCount++;
        }
    }
    if (matchCount === 0) {
        genreMatch = "incorrect";
    } else if (matchCount === guessedSet.size && matchCount === answerSet.size) {
        genreMatch = "correct";
    } else {
        genreMatch = `partially correct`;
    }

    // Compare vote averages, rounded to one decimal place
    const roundedGuessedVoteAverage = Math.round(guessed.vote_average * 10) / 10;
    const roundedAnswerVoteAverage = Math.round(answer.vote_average * 10) / 10;
    let voteAverageMatch = "correct";
    if (roundedGuessedVoteAverage > roundedAnswerVoteAverage) {
        voteAverageMatch = "higher";
    } else if (roundedGuessedVoteAverage < roundedAnswerVoteAverage) {
        voteAverageMatch = "lower";
    }

    // Compare director
    let directorMatch = "correct";
    if (guessed.director.id !== answer.director.id) {
        directorMatch = "incorrect";
    }

     // Compare actors with ID
    let actorsMatch = "incorrect";
    let matchedActors = [{ name: null, id: null }];
    if (guessed.actors.some(actor => answer.actors.map(a => a.id).includes(actor.id))) {
        actorsMatch = "correct";
        matchedActors = guessed.actors.filter(actor => answer.actors.map(a => a.id).includes(actor.id));
        if (matchedActors.length > 3) {
            matchedActors = matchedActors.slice(0, 3);
            //matchedActors.push({ name: "More...", id: null });
        }
    }


    return {
        releaseDateMatch,
        genreMatch,
        voteAverageMatch,
        directorMatch,
        actorsMatch,
        matchedActors
    }
};

const MovieHandler = ({ guessedMovie, answerMovie, onCompare }) => {
    const [answer, setAnswer] = useState(null);
    const [movieGuess, setMovieGuess] = useState(null);

    useEffect(() => {
        const fetchAnswer = async () => {
            //console.log("Fetching answer for movie ID:", answerMovie);  //answerMovie is null
            if (!answerMovie) {
                console.warn("answerMovie is null, skipping fetch");
                return;
            }
            const information = await CollectInfo({ movie_id: answerMovie });
            //console.log("Fetched answer:", information);
            setAnswer(information);
            //console.log("Fetched answer:", information);
        };
        fetchAnswer();
    }, [answerMovie, guessedMovie]);

    useEffect(() => {
        const fetchGuessedMovie = async () => {
            if (!guessedMovie || !guessedMovie.id) {
                console.warn("guessedMovie or guessedMovie.id is null, skipping fetch");
                return;
            }
            const info = await CollectInfo({ movie_id: guessedMovie.id });
            setMovieGuess(info);
            //console.log("Fetched guessed movie:", info);
        };
        fetchGuessedMovie();
    }, [guessedMovie]);

    useEffect(() => {
        if (answer && movieGuess) {
            onCompare(compareMovies(movieGuess, answer));
            //console.log("Comparing movies...");
        }
    }, [answer, movieGuess, onCompare]);

    return null;
};

export default MovieHandler;