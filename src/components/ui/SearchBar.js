import React, { useState, useEffect } from 'react';
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import '../../assets/styles/SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  // --- LÓGICA DE BÚSQUEDA EN VIVO (DEBOUNCE) ---
  useEffect(() => {
    // Espera 500ms después de que dejas de escribir para buscar
    const delayDebounceFn = setTimeout(() => {
      console.log("1. SearchBar enviando:", query);
      onSearch(query); 
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  // Función para limpiar
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-widget-container">
      <div className="search-bar-wrapper">
        {/* Icono de Lupa a la izquierda */}
        <IoSearchOutline className="search-icon-left" />
        
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="search-input-modern"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Botón de borrar (X) que solo aparece si escribes algo */}
        {query && (
          <IoCloseCircle 
            className="search-clear-btn" 
            onClick={handleClear}
            title="Limpiar búsqueda"
          />
        )}
      </div>
    </div>
  );
}

export default SearchBar;