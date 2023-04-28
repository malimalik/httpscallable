import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseCode, setResponseCode] = useState(200);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setResponseCode(null);

    const response = await fetch("https://swapi.dev/api/films/");
    if (response.status !== 200) {
      setResponseCode(response.status);
      throw new Error(
        `Sorry, there was an issue , the response code we got was: ${response.status}`
      );
    }
    const data = await response.json();
    const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });
    console.log(transformedMovies);
    setMovies(transformedMovies);
    setResponseCode(response.status);

    setIsLoading(false);
  }, []);
  // Don't add `movies` as a dependency here because it will result in an infinite loop.
  // This is because

  useEffect(() => {
    fetchMoviesHandler();
  }, []);

  let content = <p>Found no Movies</p>;

  if (movies.length > 0) content = <MoviesList movies={movies} />;
  if (responseCode !== 200) content = <p>Something went wrong</p>;
  if (isLoading) content = <p>Loading Results</p>;

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}> Fetch Again... </button>{" "}
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
