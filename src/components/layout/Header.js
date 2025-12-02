import React, { useRef, useEffect } from 'react';
import SearchResults from '../ui/SearchResults';
import { IoNotificationsOutline } from "react-icons/io5";
import '../../assets/styles/Header.css';
import logoImage from '../../assets/images/logo_saciar.png'; 

function Header({ 
  onNotificationClick, 
  children, 
  searchResults, 
  searchLoading, 
  searchHasBeenRun,
  onCloseSearch,
  usuario,
  onLogoutClick
}) {
  
  // Referencia al contenedor de la búsqueda
  const searchAreaRef = useRef(null);

  // Manejador de clics fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si no hay referencia, salimos
      if (!searchAreaRef.current) return;

      // VERIFICACIÓN: ¿El clic fue DENTRO del área de búsqueda?
      const isInside = searchAreaRef.current.contains(event.target);

      if (isInside) {
          // Si fue dentro, NO HACEMOS NADA.
          return; 
      }

      // Si fue AFUERA, intentamos cerrar
      if (searchHasBeenRun) {
          // console.log("Cerrando por clic afuera..."); // Descomenta para ver en consola si esto ocurre
          onCloseSearch();
      }
    };

    // Usamos 'mousedown' porque es más rápido que 'click' y evita conflictos de foco
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchHasBeenRun, onCloseSearch]);

  // LÓGICA DE VISUALIZACIÓN MEJORADA
  // Mostramos la lista SI:
  // 1. Se ha ejecutado una búsqueda (searchHasBeenRun es true)
  // 2. O SI hay resultados cargados (searchResults > 0), aunque la bandera diga false (para corregir el bug visual)
  const mostrarResultados = searchHasBeenRun || (searchResults && searchResults.length > 0);

  return (
    <header className="main-header">
      
      <div className="logo-area">
        <img src={logoImage} alt="Logo Saciar" className="header-logo" />
        <span className="header-title"></span>
      </div>

      {/* Área de Búsqueda */}
      { (usuario.rol === 'admin' || usuario.rol === 'voluntarios' || usuario.rol === 'benefactores') ? (
        // El REF debe estar en este div contenedor
        <div className="search-area" ref={searchAreaRef}> 
          <div className="search-widget-container">
            
            {children} {/* Aquí se renderiza el SearchBar */}
            
            {/* Panel Flotante de Resultados */}
            {mostrarResultados && (
              <SearchResults 
                resultados={searchResults} 
                cargando={searchLoading} 
              />
            )}

          </div>
        </div>
      ) : (
        <div className="search-area-spacer"></div>
      )}

      <div className="notification-area">
        { (usuario.rol === 'admin' || usuario.rol === 'voluntarios' || usuario.rol === 'benefactores') && (
          <span className="notification-icon" onClick={onNotificationClick}>
            <IoNotificationsOutline />
          </span>
        )}
        
        <button onClick={onLogoutClick} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

    </header>
  );
}

export default Header;