// frontend/src/DashboardPage.js
import React, { useState } from 'react';

import TransporteAlertas from './TransporteAlertas';
import BenefactoresCumpleanos from './BenefactoresCumpleanos';
import BenefactoresPagos from './BenefactoresPagos';
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';

// --- 1. IMPORTAR EL NUEVO FORMULARIO ---
import BenefactorForm from './BenefactorForm'; 

import './App.css';
import API_BASE_URL from './apiConfig'; 

function DashboardPage({ usuario, onLogout }) {

  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);
  
  // --- 2. ESTADO PARA MOSTRAR/OCULTAR EL FORMULARIO ---
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // (Lógica de búsqueda... sin cambios)
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
    <>
      {/* --- 3. RENDERIZAR EL FORMULARIO SI EL ESTADO ES TRUE --- */}
      {mostrarFormulario && (
        <BenefactorForm onClose={() => setMostrarFormulario(false)} />
      )}

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
            
            {/* --- 4. BOTÓN "AGREGAR" (Solo Admin y Benefactores) --- */}
            { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
                <button 
                    className="btn-agregar-benefactor" 
                    onClick={() => setMostrarFormulario(true)}
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