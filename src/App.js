// En tu archivo App.js
import React, { useState } from 'react';

// Componentes
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';
// Ya NO importamos SearchResults aquí, Header se encarga.

import './App.css';
// --- 1. IMPORTAR LA CONFIGURACIÓN DE LA API ---
import API_BASE_URL from './apiConfig';

function App() {

  // ---- ESTADO PARA EL PANEL DE NOTIFICACIONES ----
  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);

  // ---- ESTADO PARA LA BÚSQUEDA ----
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false);
  

  // --- Función que se ejecuta al buscar ---
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
      // --- 2. USA EL API_BASE_URL ---
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


  return (
    <div className="App">
      
      {/* 3. PASAR LOS DATOS DE BÚSQUEDA AL HEADER */}
      <Header 
        onNotificationClick={togglePanel}
        searchResults={resultados}
        searchLoading={buscando}
        searchHasBeenRun={haBuscado}
      >
        <SearchBar onSearch={handleSearch} />
      </Header>

      {/* 2. El panel de notificaciones (se muestra condicionalmente) */}
      {panelAbierto && <NotificationPanel />}

      {/* 3. El contenido principal de la aplicación */}
      <main className="main-content">
        
        <h1>Tablero de Cumpleaños</h1>

        <div className="cards-container">
          
          {/* 4. ELIMINAMOS SearchResults DE AQUÍ */}
          
          {/* 5. Tus tarjetas existentes */}
          <AlertasCumpleanos />
          <ProximosCumpleanos />

        </div>
      </main>
    </div>
  );
}

export default App;