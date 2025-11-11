// frontend/src/Header.js
import React from 'react';
import SearchResults from './SearchResults'; // Importamos los resultados aquí
import './App.css';

// Recibe los nuevos props de búsqueda desde App.js
function Header({ 
  onNotificationClick, 
  children, 
  searchResults, 
  searchLoading, 
  searchHasBeenRun 
}) {
  return (
    <header className="main-header">
      
      {/* 1. Área del Logo (Izquierda) */}
      <div className="logo-area">
        <img src="/logo_saciar.png" alt="Logo Saciar" className="header-logo" />
        <span className="header-title">Sistema de Alertas</span>
      </div>

      {/* 2. Área de Búsqueda (Centro) - con posición relativa */}
      <div className="search-area">
        {children} {/* Aquí se renderiza <SearchBar /> */}
        
        {/* Aquí renderizamos el panel flotante de resultados */}
        {searchHasBeenRun && (
          <SearchResults 
            resultados={searchResults} 
            cargando={searchLoading} 
          />
        )}
      </div>

      {/* 3. Área de Notificaciones (Derecha) */}
      <div className="notification-area">
        <span 
          className="notification-icon" 
          onClick={onNotificationClick} 
          role="button" 
          tabIndex="0"
          aria-label="Ver notificaciones"
        >
          🔔
        </span>
      </div>

    </header>
  );
}

export default Header;