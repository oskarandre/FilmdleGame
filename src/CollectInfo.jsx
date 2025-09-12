import { fetchMovie, fetchCredits } from './lib/tmdb.js';

export const CollectInfo = async ({ movie_id }) => {
    try {
        if (!movie_id) {
            console.warn("movie_id is null or undefined, returning null");
            return null;
        }
        
        const [movieInfo, creditsInfo] = await Promise.all([
            fetchMovie(movie_id),
            fetchCredits(movie_id)
        ]);

        const directorInfo = creditsInfo.crew.find(person => person.job === 'Director') || {name: 'Unknown', id: null};

        const information = {
            id: movieInfo.id,
            original_title: movieInfo.original_title,
            poster: movieInfo.poster_path,
            title: movieInfo.title,
            genres: movieInfo.genres,
            release_date: movieInfo.release_date,
            vote_average: movieInfo.vote_average,
            director: {
                name: directorInfo.name,
                id: directorInfo.id
            },
            actors: creditsInfo.cast.map(person => ({
                name: person.name,
                id: person.id
            }))
        };

        //console.log("Fetched information: ", information); // Debug log
        return information;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
};