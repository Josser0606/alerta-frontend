// frontend/src/DashboardPage.js
import React, { useState } from 'react';

// --- 1. IMPORTAMOS LOS NUEVOS COMPONENTES ---
import BenefactoresCumpleanos from './BenefactoresCumpleanos';
import BenefactoresPagos from './BenefactoresPagos';
// ------------------------------------------

// Componentes del Dashboard (Voluntarios)
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';

import './App.css';
import API_BASE_URL from './apiConfig'; 

function DashboardPage() {

  // ... (Toda la lógica del Header, Búsqueda y Notificaciones se queda igual) ...
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
      // (La búsqueda sigue siendo solo para Voluntarios por ahora)
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
      <Header 
        onNotificationClick={togglePanel}
        searchResults={resultados}
        searchLoading={buscando}
        searchHasBeenRun={haBuscado}
        onCloseSearch={closeSearchPopover}
      >
        <SearchBar onSearch={handleSearch} />
      </Header>

      {panelAbierto && <NotificationPanel />}

      <main className="main-content">
        <h1>Tablero de Cumpleaños</h1>
        <div className="cards-container">
          {/* Módulo de Voluntarios */}
          <AlertasCumpleanos />
          <ProximosCumpleanos />
          
          {/* --- 2. AÑADIMOS LAS NUEVAS TARJETAS --- */}
          <BenefactoresCumpleanos />
          <BenefactoresPagos />
          {/* ----------------------------------- */}
        </div>
      </main>
    </>
  );
}

export default DashboardPage;