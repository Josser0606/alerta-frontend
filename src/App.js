// En tu archivo App.js
import React, { useState } from 'react';

// Componentes de tarjetas existentes
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';

// ---- NUEVOS COMPONENTES ----
import Header from './Header'; // La barra superior
import SearchBar from './SearchBar'; // El campo de búsqueda
import NotificationPanel from './NotificationPanel'; // El panel desplegable
import SearchResults from './SearchResults'; // La tarjeta de resultados

import './App.css';

function App() {

  // ---- ESTADO PARA EL PANEL DE NOTIFICACIONES ----
  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);

  // ---- ESTADO PARA LA BÚSQUEDA ----
  const [resultados, setResultados] = useState([]); // Guarda los resultados
  const [buscando, setBuscando] = useState(false); // Para mostrar "Cargando..."
  const [haBuscado, setHaBuscado] = useState(false); // Para saber si mostrar la tarjeta de resultados

  // --- Función que se ejecuta al buscar ---
  const handleSearch = async (query) => {
    setHaBuscado(true); // Marcamos que el usuario ya buscó algo
    setBuscando(true); // Mostramos el "cargando"

    if (!query) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    try {
      // Usamos encodeURIComponent para asegurar que la URL sea válida
      const response = await fetch(`https://alerta-backend-57zs.onrender.com/api/cumpleaneros/buscar?nombre=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setResultados(data);

    } catch (error) {
      console.error("Error al buscar:", error);
      setResultados([]); // En caso de error, vaciamos resultados
    } finally {
      setBuscando(false); // Dejamos de cargar
    }
  };


  return (
    // Ya no necesitamos el <React.Fragment> (<>)
    <div className="App">
      
      {/* 1. La nueva barra de Header. Le pasamos el SearchBar COMO HIJO */}
      <Header onNotificationClick={togglePanel}>
        <SearchBar onSearch={handleSearch} />
      </Header>

      {/* 2. El panel de notificaciones (se muestra condicionalmente) */}
      {panelAbierto && <NotificationPanel />}

      {/* 3. El contenido principal de la aplicación */}
      <main className="main-content">
        
        {/* El h1 ahora está aquí, no en el header */}
        <h1>Tablero de Cumpleaños</h1>

        <div className="cards-container">
          
          {/* 4. Tarjeta de resultados (se muestra condicionalmente) */}
          {haBuscado && (
            <SearchResults 
              resultados={resultados} 
              cargando={buscando} 
            />
          )}

          {/* 5. Tus tarjetas existentes */}
          <AlertasCumpleanos />
          <ProximosCumpleanos />

        </div>
      </main>
    </div>
  );
}

export default App;