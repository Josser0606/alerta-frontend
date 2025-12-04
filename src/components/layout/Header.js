import React, { useRef, useEffect } from 'react';
import SearchResults from '../ui/SearchResults';
import AlertasBell from './AlertasBell'; // <--- Importamos el nuevo componente
import '../../assets/styles/Header.css';
import logoImage from '../../assets/images/icono (1).png'; 

function Header({ 
  children, // El SearchBar viene aquí
  searchResults, 
  searchLoading, 
  searchHasBeenRun,
  onCloseSearch,
  usuario,
  onLogoutClick
}) {
  
  const searchAreaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!searchAreaRef.current) return;
      if (searchAreaRef.current.contains(event.target)) return; 

      if (searchHasBeenRun) {
          onCloseSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchHasBeenRun, onCloseSearch]);

  const mostrarResultados = searchHasBeenRun || (searchResults && searchResults.length > 0);

  return (
    <header className="main-header">
      
      <div className="logo-area">
        <img src={logoImage} alt="Logo Saciar" className="header-logo" />
        <span className="header-title">Fundación Saciar</span>
      </div>

      {/* Área de Búsqueda */}
      { (usuario.rol === 'admin' || usuario.rol === 'voluntarios' || usuario.rol === 'benefactores') ? (
        <div className="search-area" ref={searchAreaRef}> 
          <div className="search-widget-container">
            {children} 
            
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
        
        {/* Aquí inyectamos el componente inteligente de la campana */}
        <AlertasBell usuario={usuario} />
        
        <button onClick={onLogoutClick} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

    </header>
  );
}

export default Header;