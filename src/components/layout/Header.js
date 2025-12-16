import React, { useRef, useEffect, useState } from 'react';
import SearchResults from '../ui/SearchResults';
import AlertasBell from './AlertasBell';
import ConfirmModal from '../ui/ConfirmModal'; // <--- Importamos tu nuevo modal
import '../../assets/styles/Header.css';
import logoImage from '../../assets/images/logo_saciar.png'; 

function Header({ 
  children,
  searchResults, 
  searchLoading, 
  searchHasBeenRun,
  onCloseSearch,
  usuario,
  onLogoutClick
}) {
  
  const searchAreaRef = useRef(null);
  
  // Estado para controlar la visibilidad del modal de logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Efecto para cerrar resultados al hacer clic fuera
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

  // --- HANDLERS PARA LOGOUT ---

  // 1. Al hacer clic en el botón, solo mostramos el modal (no cerramos sesión aún)
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // 2. Si el usuario confirma en el modal, procedemos con el logout real
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogoutClick();
  };

  // 3. Si cancela, simplemente ocultamos el modal
  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="main-header">
      
      <div className="logo-area">
        <img src={logoImage} alt="Logo Saciar" className="header-logo" /> 
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
        
        {/* Campanita de Alertas */}
        <AlertasBell usuario={usuario} />
        
        {/* Botón de Logout (ahora abre el modal) */}
        <button onClick={handleLogoutClick} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      {/* --- RENDERIZADO DEL MODAL DE CONFIRMACIÓN --- */}
      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="¿Cerrar Sesión?"
        message="¿Estás seguro de que deseas salir del sistema?"
        confirmText="Sí, salir"
        cancelText="Cancelar"
      />

    </header>
  );
}

export default Header;