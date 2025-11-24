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
function DashboardPage({ usuario, onLogout, onAbrirFormulario, onAbrirLista }) {

  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);
  
  // Estados para la barra de búsqueda
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false); 

  // Función de búsqueda de voluntarios
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
          // Si es ADMIN, por defecto buscamos voluntarios (o podrías hacer algo más complejo después)
          // Por ahora, dejémoslo que busque voluntarios para el admin, o benefactores si prefieres.
          // Digamos que el admin busca voluntarios por defecto:
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
            <h1>Tablero de Alertas</h1>
            
            {/* Botones de acción (Solo Admin o Benefactores) */}
            { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
                <div style={{ display: 'flex', gap: '10px' }}> 
                    
                    {/* BOTÓN 1: Abrir Lista Completa (Modal) */}
                    <button 
                        className="btn-agregar-benefactor" 
                        style={{ backgroundColor: '#2C3E50' }} // Azul oscuro para diferenciar
                        onClick={onAbrirLista} 
                    >
                        📋 Ver Lista Completa
                    </button>

                    {/* BOTÓN 2: Abrir Formulario de Agregar (Modal) */}
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