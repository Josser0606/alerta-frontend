// frontend/src/App.js
import React, { useState } from 'react';

// Componentes
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';

import './App.css';
// --- 1. IMPORTAR API_BASE_URL (ESTO ARREGLA LA BÚSQUEDA) ---
import API_BASE_URL from './apiConfig';

function App() {

  // Estado del panel de notificaciones
  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);

  // Estado de la Búsqueda
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false); 

  // --- Función que se ejecuta al buscar (AHORA CORRECTA) ---
  const handleSearch = async (query) => {
    setHaBuscado(true); 
    setBuscando(true); 

    if (!query) {
      setResultados([]);
      setBuscando(false);
      setHaBuscado(false); // Oculta el popover si la búsqueda está vacía
      return;
    }

    try {
      // --- 2. USA EL API_BASE_URL (ARREGLADO) ---
      const response = await fetch(`${API_BASE_URL}/cumpleaneros/buscar?nombre=${encodeURIComponent(query)}`);
      
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

  // --- 3. FUNCIÓN PARA CERRAR EL POPOVER (NUEVO) ---
  const closeSearchPopover = () => {
    setHaBuscado(false);
  };


  return (
    <div className="App">
      
      {/* 4. Pasamos la nueva función 'onCloseSearch' al Header */}
      <Header 
        onNotificationClick={togglePanel}
        searchResults={resultados}
        searchLoading={buscando}
        searchHasBeenRun={haBuscado}
        onCloseSearch={closeSearchPopover} // Prop para cerrar el panel
      >
        <SearchBar onSearch={handleSearch} />
      </Header>

      {panelAbierto && <NotificationPanel />}

      <main className="main-content">
        
        <h1>Tablero de Cumpleaños</h1>

        <div className="cards-container">
          <AlertasCumpleanos />
          <ProximosCumpleanos />
        </div>
      </main>
    </div>
  );
}

export default App;