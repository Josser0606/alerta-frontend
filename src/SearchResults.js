// frontend/src/SearchResults.js
import React from 'react';
import './App.css'; // Reutilizamos los mismos estilos

// Función simple para formatear la fecha
const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function SearchResults({ resultados, cargando }) {
  
  // Renderiza el popover flotante
  return (
    <div className="search-results-popover">
      <ul>
        {/* 1. Muestra "Buscando..." si está cargando */}
        {cargando && (
          <li className="search-info-item">Buscando...</li>
        )}

        {/* 2. Muestra "No encontrado" si no está cargando Y no hay resultados */}
        {!cargando && resultados.length === 0 && (
          <li className="search-info-item">No se encontraron resultados.</li>
        )}

        {/* 3. Muestra los resultados si no está cargando Y hay resultados */}
        {!cargando && resultados.map((persona) => (
          <li key={persona.id || persona.nombre_completo} className="search-result-item">
            <span className="nombre">{persona.nombre_completo}</span>
            <span className="fecha">
              ({formatearFecha(persona.fecha_nacimiento)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;