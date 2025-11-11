// frontend/src/App.js
import React, { useState } from 'react';

// Componentes
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';
import Header from './Header'; // La barra superior
import SearchBar from './SearchBar'; // El campo de búsqueda
import NotificationPanel from './NotificationPanel'; // El panel desplegable
// Ya no importamos SearchResults aquí, Header se encarga.

import './App.css';
// NO importamos 'apiConfig.js' (como pediste)

function App() {

  // Estado del panel de notificaciones
  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);

  // Estado de la Búsqueda
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false); 

  // --- Función que se ejecuta al buscar (CORREGIDA) ---
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
      // --- ESTA ES LA LÍNEA CLAVE ---
      // Volvemos a la URL de Render que sí te funcionaba
      const response = await fetch(`https://alerta-backend-57zs.onrender.com/api/cumpleaneros/buscar?nombre=${encodeURIComponent(query)}`);
      
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

  // --- Función para cerrar el popover al clicar fuera ---
  // (Esta función la usa el Header)
  const closeSearchPopover = () => {
    setHaBuscado(false);
  };


  return (
    <div className="App">
      
      {/* Pasamos todos los datos y funciones al Header */}
      <Header 
        onNotificationClick={togglePanel}
        searchResults={resultados}
        searchLoading={buscando}
        searchHasBeenRun={haBuscado}
        onCloseSearch={closeSearchPopover} // Prop para cerrar el panel
      >
        <SearchBar onSearch={handleSearch} />
      </Header>

      {/* El panel de notificaciones (se muestra condicionalmente) */}
      {panelAbierto && <NotificationPanel />}

      {/* El contenido principal de la aplicación */}
      <main className="main-content">
        
        <h1>Tablero de Cumpleaños</h1>

        <div className="cards-container">
          {/* Ya no mostramos los resultados aquí */}
          <AlertasCumpleanos />
          <ProximosCumpleanos />
        </div>
      </main>
    </div>
  );
}

export default App;