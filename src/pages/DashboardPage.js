import React, { useState, useCallback } from 'react';

// Importamos los componentes de tarjetas (Widgets)
import TransporteAlertas from '../features/transporte/TransporteAlertas';
import BenefactoresCumpleanos from '../features/benefactores/BenefactoresCumpleanos';
import BenefactoresPagos from '../features/benefactores/BenefactoresPagos';
import AlertasCumpleanos from '../features/voluntarios/AlertasCumpleanos'; // Voluntarios Hoy
import ProximosCumpleanos from '../features/voluntarios/ProximosCumpleanos'; // Voluntarios Próximos

// Importamos componentes de estructura
import Header from '../components/layout/Header';
import SearchBar from '../components/ui/SearchBar';
import NotificationPanel from '../components/layout/NotificationPanel';

// Estilos y Configuración
import '../assets/styles/Dashboard.css';
import API_BASE_URL from '../api/apiConfig'; 

function DashboardPage({ 
    usuario, 
    onLogout, 
    // Props Benefactores
    onAbrirFormulario, 
    onAbrirLista, 
    // Props Transporte
    onAbrirVehiculo, 
    onAbrirListaVehiculos,
    // Props Voluntarios (NUEVOS)
    onAbrirVoluntario,
    onAbrirListaVoluntarios 
}) {

  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);
  
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false); 

  // Función de búsqueda inteligente con useCallback
  const handleSearch = useCallback(async (query) => {
    // 1. Si NO hay texto (o está vacío), limpiamos y CERRAMOS el panel.
    console.log("2. Dashboard recibió:", query); // <--- AGREGA ESTO
    if (!query || query.trim() === '') {
      console.log("   -> Búsqueda vacía, limpiando."); // <--- AGREGA ESTO
      setResultados([]);
      setBuscando(false);
      setHaBuscado(false); // <--- CLAVE: Forzamos el cierre si está vacío
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
          // Si es ADMIN, por defecto buscamos voluntarios (o lo que prefieras)
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
  }, [usuario.rol]);

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
            {/* Título del Dashboard */}
            <h1>Tablero de Alertas <small>({usuario.rol})</small></h1>
            
            {/* --- GRUPO 1: BOTONES VOLUNTARIOS (NUEVO) --- */}
            { (usuario.rol === 'admin' || usuario.rol === 'voluntarios') && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}> 
                    <button 
                        className="btn-agregar-benefactor btn-secundario" 
                        onClick={onAbrirListaVoluntarios} 
                    >
                        👥 Ver Lista Voluntarios
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirVoluntario} 
                    >
                        + Nuevo Voluntario
                    </button>
                </div>
            )}

            {/* --- GRUPO 2: BOTONES BENEFACTORES --- */}
            { (usuario.rol === 'admin' || usuario.rol === 'benefactores') && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}> 
                    <button 
                        className="btn-agregar-benefactor btn-secundario" 
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

            {/* --- GRUPO 3: BOTONES TRANSPORTE --- */}
            { (usuario.rol === 'admin' || usuario.rol === 'transporte') && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                        className="btn-agregar-benefactor btn-secundario" 
                        onClick={onAbrirListaVehiculos} 
                    >
                        🚌 Ver Flota
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
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