// frontend/src/Header.js
import React, { useRef, useEffect } from 'react';
import SearchResults from '../ui/SearchResults';
import { IoNotificationsOutline } from "react-icons/io5";
import '../../assets/styles/Header.css';

// --- 1. RECIBIMOS LOS NUEVOS PROPS ---
function Header({ 
  onNotificationClick, 
  children, 
  searchResults, 
  searchLoading, 
  searchHasBeenRun,
  onCloseSearch,
  usuario,         // <-- Prop de Usuario (para saber el rol)
  onLogoutClick    // <-- Prop de Función de Logout
}) {
  
  // (La lógica para cerrar el popover al clicar fuera se queda igual)
  const searchAreaRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchHasBeenRun && searchAreaRef.current && !searchAreaRef.current.contains(event.target)) {
         onCloseSearch();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchHasBeenRun, onCloseSearch]);
  console.log("5. Header renderizando. Resultados:", searchResults.length, "| ¿Buscó?:", searchHasBeenRun);


  return (
    <header className="main-header">
      
      <div className="logo-area">
        <img src="/logo_saciar.png" alt="Logo Saciar" className="header-logo" />
      </div>

      {/* --- 2. ÁREA DE BÚSQUEDA CONDICIONAL --- */}
      {/* Solo se muestra si el rol es 'admin' o 'voluntarios' */}
      { (usuario.rol === 'admin' || usuario.rol === 'voluntarios' || usuario.rol === 'benefactores') ? (
        <div className="search-area" ref={searchAreaRef}>
          <div className="search-widget-container">
            {children} {/* <SearchBar /> */}
            {searchHasBeenRun && (
              <SearchResults 
                resultados={searchResults} 
                cargando={searchLoading} 
              />
            )}
          </div>
        </div>
      ) : (
        // Si no, dejamos un espacio vacío para centrar
        <div className="search-area-spacer"></div>
      )}

      {/* --- 3. ÁREA DE NOTIFICACIÓN (MODIFICADA) --- */}
      <div className="notification-area">
        
        {/* Campana condicional (solo 'admin' o 'voluntarios') */}
        { (usuario.rol === 'admin' || usuario.rol === 'voluntarios' || usuario.rol === 'benefactores') && (
          <span 
            className="notification-icon" 
            onClick={onNotificationClick} 
            role="button" 
            tabIndex="0"
            aria-label="Ver notificaciones"
          >
            <IoNotificationsOutline />
          </span>
        )}
        
        {/* --- 4. NUEVO BOTÓN DE CERRAR SESIÓN --- */}
        <button onClick={onLogoutClick} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

    </header>
  );
}

export default Header;