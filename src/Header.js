// frontend/src/Header.js
import React from 'react';
import './App.css'; // Usamos los mismos estilos

// Recibe dos "props":
// 1. onNotificationClick: La función a ejecutar al dar clic en la campana
// 2. children: Cualquier cosa que pongamos dentro de <Header> en App.js (en este caso, el SearchBar)
function Header({ onNotificationClick, children }) {
  return (
    <header className="main-header">
      
      {/* Logo y Título */}
      <div className="logo-area">
        <img src="/logo_saciar.png" alt="Logo Saciar" className="header-logo" />
        <span className="header-title">Sistema de Alertas</span>
      </div>

      {/* Acciones (Búsqueda e Icono) */}
      <div className="actions-area">
        {children} {/* Aquí se renderiza <SearchBar /> */}
        
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