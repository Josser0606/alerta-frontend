import React, { useState, useCallback } from 'react';

// Importamos los componentes de tarjetas (Widgets)
import TransporteAlertas from '../features/transporte/TransporteAlertas';
import BenefactoresCumpleanos from '../features/benefactores/BenefactoresCumpleanos';
import BenefactoresPagos from '../features/benefactores/BenefactoresPagos';
import AlertasCumpleanos from '../features/voluntarios/AlertasCumpleanos';
import ProximosCumpleanos from '../features/voluntarios/ProximosCumpleanos';

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

    // Props Voluntarios
    onAbrirVoluntario,
    onAbrirListaVoluntarios,

    // Props Inventario (¡NUEVO!)
    onAbrirInventario,
    onAbrirListaInventario
}) {

  const [panelAbierto, setPanelAbierto] = useState(false);
  const togglePanel = () => setPanelAbierto(!panelAbierto);
  
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [haBuscado, setHaBuscado] = useState(false); 

  // Función de búsqueda inteligente con useCallback
  const handleSearch = useCallback(async (query) => {
    setHaBuscado(true); 
    setBuscando(true); 
    
    if (!query) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    try {
      let endpoint = '';

      // LÓGICA: Decidir dónde buscar según el rol
      if (usuario.rol === 'voluntarios') {
          endpoint = `${API_BASE_URL}/voluntarios/buscar?nombre=${encodeURIComponent(query)}`;
      } else if (usuario.rol === 'benefactores') {
          endpoint = `${API_BASE_URL}/benefactores/buscar?nombre=${encodeURIComponent(query)}`;
      } else if (usuario.rol === 'inventario') { // Nuevo rol
          // Asumiendo que creaste la ruta de búsqueda en inventarioRoutes.js
          // Si no, el admin busca voluntarios por defecto
           endpoint = `${API_BASE_URL}/inventario/todos?search=${encodeURIComponent(query)}`; 
           // Nota: La ruta /todos ya filtra, pero para el buscador rápido del header 
           // idealmente deberías tener un endpoint /inventario/buscar ligero.
           // Si no existe, esto podría devolver muchos datos.
      } else {
          // Si es ADMIN, por defecto buscamos voluntarios (o lo que prefieras)
          endpoint = `${API_BASE_URL}/voluntarios/buscar?nombre=${encodeURIComponent(query)}`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Error en la búsqueda');
      const data = await response.json();
      
      // Ajuste si el endpoint de inventario devuelve array directo
      if (usuario.rol === 'inventario' && Array.isArray(data)) {
          setResultados(data); 
      } else {
          setResultados(data);
      }

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
            
            {/* --- GRUPO 1: BOTONES VOLUNTARIOS --- */}
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

            {/* --- GRUPO 4: BOTONES INVENTARIO (¡NUEVO!) --- */}
            {/* Ajusta 'inventario' si tu rol se llama diferente en la BD */}
            { (usuario.rol === 'admin' || usuario.rol === 'inventario') && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                        className="btn-agregar-benefactor btn-secundario" 
                        onClick={onAbrirListaInventario} 
                    >
                        📦 Ver Inventario
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirInventario} 
                    >
                        + Nuevo Item
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

          {/* Módulo Inventario (Opcional: Si quieres mostrar widgets de inventario) */}
          {/* Por ahora no tienes widgets de alertas para inventario, así que no mostramos nada aquí */}
          
        </div>
      </main>
    </>
  );
}

export default DashboardPage;