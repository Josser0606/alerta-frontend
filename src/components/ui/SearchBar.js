// frontend/src/SearchBar.js
import React, { useState } from 'react';
import '../../assets/styles/SearchBar.css';

// Recibe la función 'onSearch' que viene de App.js
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  // Manejador del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    onSearch(query); // Llama a la función de App.js con el texto actual
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-button">
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;