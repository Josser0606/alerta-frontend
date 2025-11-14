// frontend/src/DashboardPage.js
import React, { useState } from 'react';

// Ya no importamos BenefactorForm aquí
import TransporteAlertas from './TransporteAlertas';
import BenefactoresCumpleanos from './BenefactoresCumpleanos';
import BenefactoresPagos from './BenefactoresPagos';
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';
import './App.css';
import API_BASE_URL from './apiConfig'; 

// Recibimos 'onAbrirFormulario' desde App.js
function DashboardPage({ usuario, onLogout, onAbrirFormulario }) {

  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);
  
  // El estado 'mostrarFormulario' YA NO VIVE AQUÍ
  // const [mostrarFormulario, setMostrarFormulario] = useState(false);

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
      if (!response.ok) throw new Error('Error en la búsqueda');
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error al buscar:", error);
      setResultados([]); 
    } finally {
      setBuscando(false); 
    }
  };
  const closeSearchPopover = () => { setHaBuscado(false); };

  return (
    // Cambiamos el Fragment ( <> ) por un div para que el modal de búsqueda (popover) tenga un ancla.
    // O mejor, dejemos el Fragment, el CSS ya maneja el anclaje relativo.
    <>
      {/* El formulario modal YA NO ESTÁ AQUÍ */}

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

      {panelAbierto && <NotificationPanel />}

      <main className="main-content">
        
        <div className="titulo-y-acciones">
            <h1>Tablero de Alertas</h1>
            
            {/* ESTE BOTÓN AHORA LLAMA A LA FUNCIÓN DE App.js */}
            { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
                <button 
                    className="btn-agregar-benefactor" 
                    onClick={onAbrirFormulario} // <-- Cambio aquí
                >
                    + Agregar Benefactor
                </button>
            )}
        </div>

        <div className="cards-container">
          
          {/* Módulo Voluntarios */}
          { (usuario.rol === 'admin' || usuario.rol === 'voluntarios') && (
            <>
              <AlertasCumpleanos />
              <ProximosCumpleanos />
            </>
          )}
          
          {/* Módulo Benefactores */}
          { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
            <>
              <BenefactoresCumpleanos />
              <BenefactoresPagos />
            </>
          )}

          {/* Módulo Transporte */}
          { (usuario.rol === 'admin' || usuario.rol === 'transporte') && (
            <TransporteAlertas />
          )}
          
        </div>
      </main>
    </>
  );
}

export default DashboardPage;