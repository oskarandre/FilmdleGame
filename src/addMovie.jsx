import React, { useState, useCallback, useEffect, useMemo } from 'react';
import MovieHandler from './MovieCompare';
import { PreviewActor } from './PreviewActor';
import { OverlayTrigger, Popover } from 'react-bootstrap';


const NewFilm = ({ movies, correctMovieId, shouldAnimate = () => true }) => {
    const [comparisonResults, setComparisonResults] = useState({});
    const [previewActorId, setPreviewActorId] = useState(null);

    const handleCompare = useCallback((index, result) => {
        setComparisonResults(prevResults => ({
            ...prevResults,
            [index]: result
        }));
    }, []);

    const memoizedMovieHandlers = useMemo(() => {
        if (!correctMovieId) {
            console.warn("correctMovieId is null, cannot create movie handlers");
            return [];
        }
        return movies.map((movie, index) => {
            if (!movie || !movie.id) {
                console.warn("Movie data is invalid:", movie);
                return null;
            }
            return (
                <MovieHandler 
                    key={movie.id} 
                    guessedMovie={movie} 
                    answerMovie={correctMovieId} 
                    onCompare={(result) => handleCompare(index, result)} 
                />
            );
        }).filter(Boolean);
    }, [movies, correctMovieId, handleCompare]);

    // Function to determine the card class based on comparison result
    const getCardClass = (index, feature) => {
        const result = comparisonResults[index] ? comparisonResults[index][feature] : null;
        switch (result) {
            case "correct":
                return "card correct";
            case "incorrect":
                return "card incorrect";
            case "higher":
                return "card higher";
            case "lower":
                return "card lower";
            case "partially correct":
                return "card partially-correct";
            default:
                return "card";
        }
    };

    const renderMoviesList = (movies) => {
        return movies.map((movie, index) => {
            if (!movie || !movie.id) {
                console.warn("Invalid movie data in renderMoviesList:", movie);
                return null;
            }
            
            // Define the 6 cards in order: poster, genre, year, director, actors, rating
            const cards = [
                { type: "poster", cardClass: "card", content: null },
                { type: "genre", cardClass: getCardClass(index, "genreMatch"), content: "genres" },
                { type: "year", cardClass: getCardClass(index, "releaseDateMatch"), content: "year" },
                { type: "director", cardClass: getCardClass(index, "directorMatch"), content: "director" },
                { type: "actors", cardClass: getCardClass(index, "actorsMatch"), content: "actors" },
                { type: "rating", cardClass: getCardClass(index, "voteAverageMatch"), content: "rating" }
            ];
            
            return (

                <li key={movie.id} className="movie-list-item">
                    {memoizedMovieHandlers[index]}
                    <div className="card-deck pb-3 ">
                        {cards.map((card, cardIndex) => {
                            const movieShouldAnimate = shouldAnimate(movie);
                            const combinedDelayClass = movieShouldAnimate ? `animate__flipInY--delay-${Math.min(index, 5)}-${cardIndex}` : '';
                            const animationClasses = movieShouldAnimate ? 'animate__animated animate__flipInY' : '';
                            
                            return (
                                <div key={cardIndex} className={`${card.cardClass} ${animationClasses} ${combinedDelayClass}`}>
                                    {card.type === "poster" ? (
                                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster}`} className="card-img-top" alt={movie.original_title} />
                                    ) : (
                                        <div className="card-body text-center">
                                            <p className="card-text">
                                                {card.content === "genres" && (
                                                    /* Show maximum 4 genres */
                                                    movie.genres.slice(0, 4).map(genre => genre.name).join(', ')
                                                )}
                                                {card.content === "year" && (
                                                    /* shows only year */
                                                    movie.release_date.split("-")[0]
                                                )}
                                                {card.content === "director" && (
                                                    <OverlayTrigger
                                                        trigger={['hover', 'focus']}
                                                        placement="auto"
                                                        flip={true}
                                                        popperConfig={{
                                                            modifiers: [
                                                                {
                                                                    name: 'preventOverflow',
                                                                    options: {
                                                                        boundary: 'viewport',
                                                                    },
                                                                },
                                                                {
                                                                    name: 'flip',
                                                                    options: {
                                                                        fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                                                                    },
                                                                },
                                                            ],
                                                        }}
                                                        overlay={
                                                            <Popover id={`popover-positioned-bottom`}>
                                                                <Popover.Header as="h3">{movie.director.name}</Popover.Header>
                                                                <Popover.Body>
                                                                    <PreviewActor actor_id={movie.director.id} />
                                                                </Popover.Body>
                                                            </Popover>
                                                        }
                                                    >
                                                        <span style={{ cursor: 'pointer' }}>
                                                            {movie.director.name}
                                                        </span>
                                                    </OverlayTrigger>
                                                )}
                                                {card.content === "actors" && (
                                                    /* compare matched actors with movie to find index of actor names */
                                                    comparisonResults[index] && comparisonResults[index].matchedActors[0].name ? (
                                                        comparisonResults[index].matchedActors.map(actor => (
                                                            <OverlayTrigger
                                                                key={actor.id}
                                                                trigger={['hover', 'focus']}
                                                                placement="auto"
                                                                flip={true}
                                                                popperConfig={{
                                                                    modifiers: [
                                                                        {
                                                                            name: 'preventOverflow',
                                                                            options: {
                                                                                boundary: 'viewport',
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'flip',
                                                                            options: {
                                                                                fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                                                                            },
                                                                        },
                                                                    ],
                                                                }}
                                                                overlay={
                                                                    <Popover id={`popover-positioned-bottom`}>
                                                                        <Popover.Header as="h3">{actor.name}</Popover.Header>
                                                                        <Popover.Body>
                                                                            <PreviewActor actor_id={actor.id} />
                                                                        </Popover.Body>
                                                                    </Popover>
                                                                }
                                                            >
                                                                <span style={{ cursor: 'pointer' }}>
                                                                    {actor.name}
                                                                </span>
                                                            </OverlayTrigger>
                                                        )).reduce((prev, curr) => [prev, ', ', curr])
                                                    ) : (
                                                        "None"
                                                    )
                                                )}
                                                {card.content === "rating" && (
                                                    movie.vote_average.toFixed(1)
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </li>
            );
        }).filter(Boolean);
    };

    if (!movies) return null;
    
    if (!correctMovieId) {
        return <div></div>;
    }

    return (
        <div>
            <ul className="movie-list">
                {renderMoviesList([...movies])}
            </ul>
            {previewActorId && <PreviewActor actor_id={previewActorId} />}
        </div>
    );
};

export default NewFilm;