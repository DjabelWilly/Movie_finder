import React, { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchIcon from "./search.svg";
import "./App.css";
import API_URL from "./config/constants";

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedMovieId, setSelectedMovieId] = useState(null); // Gère l'affichage d'un seul film

    const getMovies = async (title) => {
        try {
            const response = await fetch(`${API_URL}/movies?title=${title}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText);
            }
            const data = await response.json();
            setMovies(data.Search || []);
            setMessage(data.Search && data.Search.length > 0 ? "" : "Désolé, nous n'avons rien trouvé avec ce nom.");
        } catch (error) {
            console.error("Une erreur est survenue:", error);
            setMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
        }
    };

    const handleTerm = (e) => {
        setSearchTerm(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""));
        setMessage("");
    };

    return (
        <div className="app">
            <h1>Movie Finder</h1>
            <div className="search">
                <input
                    value={searchTerm}
                    onChange={handleTerm}
                    placeholder="Entrez un nom de film ou une série"
                />
                <img src={SearchIcon} alt="search" onClick={() => getMovies(searchTerm)} />
            </div>
            {message && <p className="message">{message}</p>}

            {/* Si un film est sélectionné, afficher uniquement ce film */}
            {selectedMovieId ? (
                <MovieCard
                    movie={movies.find((m) => m.imdbID === selectedMovieId)}
                    selectedMovieId={selectedMovieId}
                    setSelectedMovieId={setSelectedMovieId}
                />
            ) : (
                <div className="container">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.imdbID}
                            movie={movie}
                            selectedMovieId={selectedMovieId}
                            setSelectedMovieId={setSelectedMovieId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
