// frontend/src/SearchResults.js
import React from 'react';
import './App.css'; // Reutilizamos los mismos estilos

// Función simple para formatear la fecha
const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function SearchResults({ resultados, cargando }) {
  
  // 1. Estado de Carga
  if (cargando) {
    return (
      <div className="alerta-card cargando">
        Buscando...
      </div>
    );
  }

  // 2. Estado sin resultados
  if (resultados.length === 0) {
    return (
      <div className="alerta-card empty">
        <p>No se encontraron resultados.</p>
      </div>
    );
  }

  // 3. Estado con resultados
  return (
    // Usamos una nueva clase 'search' para darle estilo
    <div className="alerta-card search">
      <h3>Resultados de Búsqueda</h3>
      <ul>
        {resultados.map((persona) => (
          <li key={persona.id || persona.nombre_completo}>
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