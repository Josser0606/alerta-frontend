// frontend/src/Header.js
import React, { useRef, useEffect } from 'react'; // Importamos hooks
import SearchResults from './SearchResults';
import { IoNotificationsOutline } from "react-icons/io5";
import './App.css';

function Header({ 
  onNotificationClick, 
  children, 
  searchResults, 
  searchLoading, 
  searchHasBeenRun,
  onCloseSearch // <-- Recibimos la nueva prop
}) {
  
  // --- 1. LÓGICA PARA CERRAR AL CLICAR FUERA ---
  const searchAreaRef = useRef(null); // Ref para el contenedor de búsqueda

  useEffect(() => {
    // Función que se ejecuta en CUALQUIER clic del documento
    function handleClickOutside(event) {
      // Si el panel está abierto (searchHasBeenRun) Y
      // si el clic NO fue dentro del contenedor (searchAreaRef.current)
      if (searchHasBeenRun && searchAreaRef.current && !searchAreaRef.current.contains(event.target)) {
         onCloseSearch(); // Llamamos a la función del padre (App.js)
      }
    }
    // Añadimos el listener
    document.addEventListener("mousedown", handleClickOutside);
    // Limpiamos el listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchHasBeenRun, onCloseSearch]); // Depende de estas props
  // --- FIN DE LA LÓGICA ---


  return (
    <header className="main-header">
      
      <div className="logo-area">
        <img src="/logo_saciar.png" alt="Logo Saciar" className="header-logo" />
      </div>

      {/* 2. ÁREA DE BÚSQUEDA (CON REF) ---
          Le pasamos el ref 'searchAreaRef' a este div */}
      <div className="search-area" ref={searchAreaRef}>
        {/* 3. NUEVO CONTENEDOR PARA EL ANCHO 
            Este div soluciona el problema del ancho (Problema #1) */}
        <div className="search-widget-container">
          {children} {/* <SearchBar /> */}
          
          {/* El popover de resultados ahora está dentro del contenedor con el ancho correcto */}
          {searchHasBeenRun && (
            <SearchResults 
              resultados={searchResults} 
              cargando={searchLoading} 
            />
          )}
        </div>
      </div>

      <div className="notification-area">
        <span 
          className="notification-icon" 
          onClick={onNotificationClick} 
          role="button" 
          tabIndex="0"
          aria-label="Ver notificaciones"
        >
          <IoNotificationsOutline />
        </span>
      </div>

    </header>
  );
}

export default Header;