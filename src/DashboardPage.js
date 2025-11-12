// frontend/src/DashboardPage.js
import React, { useState } from 'react';

// Importamos TODOS los módulos
import TransporteAlertas from './TransporteAlertas';
import BenefactoresCumpleanos from './BenefactoresCumpleanos';
import BenefactoresPagos from './BenefactoresPagos';
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';

// Componentes del Header
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';

import './App.css';
import API_BASE_URL from './apiConfig'; 

// --- 1. RECIBIMOS 'usuario' Y 'onLogout' ---
function DashboardPage({ usuario, onLogout }) {

  // ... (La lógica del Header/Búsqueda se queda igual) ...
  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false); 

  const handleSearch = async (query) => {
    setHaBuscado(true); 
    setBuscando(true); 
    if (!query) {
      setResultados([]);
      setBuscando(false);
      setHaBuscado(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/voluntarios/buscar?nombre=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error al buscar:", error);
      setResultados([]); 
    } finally {
      setBuscando(false); 
    }
  };
  const closeSearchPopover = () => {
    setHaBuscado(false);
  };


  return (
    <>
      {/* --- 2. PASAMOS 'usuario' Y 'onLogout' AL HEADER --- */}
      <Header 
        usuario={usuario}
        onLogoutClick={onLogout}
        onNotificationClick={togglePanel}
        searchResults={resultados}
        searchLoading={buscando}
        searchHasBeenRun={haBuscado}
        onCloseSearch={closeSearchPopover}
      >
        <SearchBar onSearch={handleSearch} />
      </Header>

      {/* El panel de notificaciones (se mostrará u ocultará junto con el Header) */}
      {panelAbierto && <NotificationPanel />}

      <main className="main-content">
        <h1>Tablero de Alertas</h1>
        <div className="cards-container">
          
          {/* --- 3. LÓGICA DE ROLES (RENDERIZADO CONDICIONAL) --- */}

          {/* Módulo Voluntarios (Solo para 'admin' o 'voluntarios') */}
          { (usuario.rol === 'admin' || usuario.rol === 'voluntarios') && (
            <>
              <AlertasCumpleanos />
              <ProximosCumpleanos />
            </>
          )}
          
          {/* Módulo Benefactores (Solo para 'admin' o 'benefactores') */}
          { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
            <>
              <BenefactoresCumpleanos />
              <BenefactoresPagos />
            </>
          )}

          {/* Módulo Transporte (Solo para 'admin' o 'transporte') */}
          { (usuario.rol === 'admin' || usuario.rol === 'transporte') && (
            <TransporteAlertas />
          )}
          
        </div>
      </main>
    </>
  );
}

export default DashboardPage;