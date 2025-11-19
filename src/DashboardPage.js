// frontend/src/DashboardPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. IMPORTAR ESTO

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

function DashboardPage({ usuario, onLogout, onAbrirFormulario }) {

  // <--- 2. INICIALIZAR EL NAVIGATE
  const navigate = useNavigate();

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
            
            { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
                /* <--- 3. AGREGAMOS UN CONTENEDOR PARA LOS DOS BOTONES */
                <div style={{ display: 'flex', gap: '10px' }}> 
                    
                    {/* BOTÓN NUEVO: LISTA COMPLETA */}
                    <button 
                        className="btn-agregar-benefactor" // Puedes crear una clase .btn-lista si quieres otro color
                        style={{ backgroundColor: '#2C3E50' }} // Ejemplo: color diferente (Azul oscuro)
                        onClick={() => navigate('/benefactores/lista')} 
                    >
                        📋 Ver Lista Completa
                    </button>

                    {/* BOTÓN EXISTENTE: AGREGAR */}
                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirFormulario} 
                    >
                        + Agregar Benefactor
                    </button>
                </div>
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