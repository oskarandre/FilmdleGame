import React, { useState, useCallback, useEffect, useMemo } from 'react';
import MovieHandler from './MovieCompare';
import { PreviewActor } from './PreviewActor';
import { OverlayTrigger, Popover } from 'react-bootstrap';


const NewFilm = ({ movies, correctMovieId }) => {
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
        return movies.map((movie, index) => (
            <MovieHandler 
                key={movie.id} 
                guessedMovie={movie} 
                answerMovie={correctMovieId} 
                onCompare={(result) => handleCompare(index, result)} 
            />
        ));
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
            return (

                <li key={movie.id} className="movie-list-item">
                    {memoizedMovieHandlers[index]}
                    <div className="card-deck pb-3 ">
                        <div className={`card animate__animated animate__flipInY`}>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster}`} className="card-img-top" alt={movie.original_title} />
                        </div>
                        <div className={`${getCardClass(index, "genreMatch")} animate__animated animate__flipInY`}>
                            <div className="card-body text-center">
                                <p className="card-text">
                                    {/* Show maximum 4 genres */}
                                    {movie.genres.slice(0, 4).map(genre => genre.name).join(', ')}
                                </p>
                            </div>
                        </div>
                        <div className={`${getCardClass(index, "releaseDateMatch")} animate__animated animate__flipInY`}>
                            <div className="card-body text-center">
                                <p className="card-text">
                                    {/* shows only year */}
                                    {movie.release_date.split("-")[0]}
                                </p>
                            </div>
                        </div>
                        <div className={`${getCardClass(index, "directorMatch")} animate__animated animate__flipInY`}>
                            <div className="card-body text-center">
                                <p className="card-text">
                                    <OverlayTrigger
                                        trigger={['hover', 'focus']}
                                        placement="bottom"
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
                                </p>
                            </div>
                        </div>
                        <div className={`${getCardClass(index, "actorsMatch")} animate__animated animate__flipInY`}>
                            <div className="card-body text-center">
                                <p className="card-text">
                                    {/* compare matched actors with movie to find index of actor names */}
                                    {comparisonResults[index] && comparisonResults[index].matchedActors[0].name ? (
                                        comparisonResults[index].matchedActors.map(actor => (
                                            <OverlayTrigger
                                                key={actor.id}
                                                trigger={['hover', 'focus']}
                                                placement="bottom"
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
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className={`${getCardClass(index, "voteAverageMatch")} animate__animated animate__flipInY`}>
                            <div className="card-body text-center">
                                <p className="card-text">{movie.vote_average.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                </li>
            );
        });
    };

    if (!movies) return null;
    
    if (!correctMovieId) {
        return <div>Loading game data...</div>;
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