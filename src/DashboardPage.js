// frontend/src/DashboardPage.js
import React, { useState } from 'react';

// Componentes del Dashboard
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';
// (SearchResults es importado por Header)

import './App.css';
import API_BASE_URL from './apiConfig'; // Importamos la URL

function DashboardPage() {

  // --- Toda esta lógica es la que ya tenías en App.js ---
  
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
      // --- RUTA CORREGIDA ---
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

  // --- El return es tu app antigua ---
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
        <h1>Tablero de Cumpleaños (Voluntarios)</h1>
        <div className="cards-container">
          <AlertasCumpleanos />
          <ProximosCumpleanos />
        </div>
      </main>
    </>
  );
}

export default DashboardPage;