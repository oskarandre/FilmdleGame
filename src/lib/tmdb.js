const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_BEARER;

const defaultOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

async function centralizedFetch(path, init) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, { ...defaultOptions, ...init });
  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}`);
  }
  return response.json();
}

export async function searchMovies(query) {
  if (!query) return [];
  let allResults = [];
  const maxPages = 5;
  for (let page = 1; page <= maxPages; page++) {
    const json = await centralizedFetch(
      `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`
    );
    if (json && Array.isArray(json.results)) {
      allResults = allResults.concat(json.results);
      if (page >= json.total_pages) break; // Stop if fewer pages available
    } else {
      break;
    }
  }
  return allResults;
}

export function fetchMovie(id) {
  return centralizedFetch(`/movie/${id}`);
}

export function fetchCredits(id) {
  return centralizedFetch(`/movie/${id}/credits`);
}

export function fetchPerson(id) {
  return centralizedFetch(`/person/${id}`);
}


