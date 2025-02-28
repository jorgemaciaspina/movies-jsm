import { useEffect, useState } from 'react'
import './App.css'

import Search from './components/Search'

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

  const fetchMovies = async () => {
    try{
      const endpoint = `${TMDB_API_URL}/discover/movie?sort_by=propularity.desc`
      const response = await fetch(endpoint, TMDB_API_OPTIONS);
      console.log(response);
    }catch(error){
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Hay un problema obteniendo las películas, favor intentalo más tarde.')
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [])

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
          <h2>Todas las peliculas</h2>

          { errorMessage && <p className='error-message'>{errorMessage}</p>}
        </section>
      </div>
    </main>
  )
}

export default App
