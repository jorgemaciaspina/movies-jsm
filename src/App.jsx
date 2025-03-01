import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'; 
import './App.css'

import Search from './components/Search'
import Spiner from './components/Spiner';
import MovieCard from './components/MovieCard';
import { updateSearchCount } from './appwrite';

// TMDB API
const TMDB_API_URL = import.meta.env.VITE_TMDB_API_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_OPTIONS = {
  method: "GET",
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();

  // debounce, prevents unnecessary API calls, only makes a call after 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = query ? `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(query)}` : `${TMDB_API_URL}/discover/movie?sort_by=propularity.desc`
      const response = await fetch(endpoint, TMDB_API_OPTIONS);
      if(!response.ok){
        throw new Error('Ocurrio un error obteniendo las peliculas')
      }
      const data = await response.json();
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Ocurrio un error obteniendo las peliculas');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
    }catch(error){
      setErrorMessage('Hay un problema obteniendo las películas, favor intentalo más tarde.')
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1> Encuentra tu <span className="text-gradient">película</span> favorita sin complicaciones</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className='all-movies'>
          <h2 className="mt-[40px]">Todas las peliculas</h2>

          {isLoading && (
            <Spiner />
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {movieList.length > 0 && (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={`movie-card-${movie.id}`} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
