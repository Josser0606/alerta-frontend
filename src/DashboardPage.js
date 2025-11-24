import React, { useState } from 'react';

// Importamos los componentes de tarjetas (Widgets)
import TransporteAlertas from './TransporteAlertas';
import BenefactoresCumpleanos from './BenefactoresCumpleanos';
import BenefactoresPagos from './BenefactoresPagos';
import AlertasCumpleanos from './AlertasCumpleanos';
import ProximosCumpleanos from './ProximosCumpleanos';

// Importamos componentes de estructura
import Header from './Header';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';

// Estilos y Configuración
import './App.css';
import API_BASE_URL from './apiConfig'; 

// Recibimos las funciones para abrir los modales desde App.js
function DashboardPage({ usuario, onLogout, onAbrirFormulario, onAbrirLista, onAbrirVehiculo, onAbrirListaVehiculos }) {

  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);
  
  // Estados para la barra de búsqueda
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false); 

  // Función de búsqueda inteligente
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
      let endpoint = '';

      // LÓGICA: Decidir dónde buscar según el rol
      if (usuario.rol === 'voluntarios') {
          endpoint = `${API_BASE_URL}/voluntarios/buscar?nombre=${encodeURIComponent(query)}`;
      } else if (usuario.rol === 'benefactores') {
          endpoint = `${API_BASE_URL}/benefactores/buscar?nombre=${encodeURIComponent(query)}`;
      } else {
          // Si es ADMIN, por defecto buscamos voluntarios
          endpoint = `${API_BASE_URL}/voluntarios/buscar?nombre=${encodeURIComponent(query)}`;
      }

      const response = await fetch(endpoint);
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
      {/* Encabezado con buscador y notificaciones */}
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

      {/* Panel lateral de notificaciones (si está abierto) */}
      {panelAbierto && <NotificationPanel />}

      <main className="main-content">
        
        <div className="titulo-y-acciones">
            {/* Mostramos el rol para depurar si no salen los botones */}
            <h1>Tablero de Alertas <small style={{fontSize:'0.5em', opacity:0.7}}>({usuario.rol})</small></h1>
            
            {/* --- GRUPO 1: BOTONES BENEFACTORES --- */}
            {/* Solo visible para ADMIN o BENEFACTORES */}
            { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}> 
                    <button 
                        className="btn-agregar-benefactor" 
                        style={{ backgroundColor: '#2C3E50' }} 
                        onClick={onAbrirLista} 
                    >
                        📋 Ver Lista Benefactores
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirFormulario} 
                    >
                        + Agregar Benefactor
                    </button>
                </div>
            )}

            {/* --- GRUPO 2: BOTONES TRANSPORTE --- */}
            {/* Solo visible para ADMIN o TRANSPORTE */}
            { (usuario.rol === 'admin' || usuario.rol === 'transporte') && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    {/* ESTE ES EL BOTÓN QUE TE FALTABA */}
                    <button 
                        className="btn-agregar-benefactor" 
                        style={{ backgroundColor: '#4682B4' }} // Azul diferente
                        onClick={onAbrirListaVehiculos} 
                    >
                        🚌 Ver Flota
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        style={{ backgroundColor: '#5bc0de' }} 
                        onClick={onAbrirVehiculo} 
                    >
                        + Nuevo Vehículo
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