import React, { useState, useCallback } from 'react';
import { MdOutlineInventory2 } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import { IoPeopleOutline } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuTruck } from "react-icons/lu";

// Importamos los componentes de tarjetas (Widgets)
import TransporteAlertas from '../features/transporte/TransporteAlertas';
import BenefactoresCumpleanos from '../features/benefactores/BenefactoresCumpleanos';
import BenefactoresPagos from '../features/benefactores/BenefactoresPagos';
import AlertasCumpleanos from '../features/voluntarios/AlertasCumpleanos';
import ProximosCumpleanos from '../features/voluntarios/ProximosCumpleanos';
// IMPORTACIÓN NUEVA:
import InventarioResumen from '../features/inventario/InventarioResumen';

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

    // Props Inventario
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
      } else if (usuario.rol === 'inventario') { 
           // Usamos la ruta de listado con filtro para buscar en inventario
           endpoint = `${API_BASE_URL}/inventario/todos?search=${encodeURIComponent(query)}`; 
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
            <h1>Tablero de Información <small>({usuario.rol})</small></h1>
            
            {/* --- GRUPO 1: BOTONES VOLUNTARIOS --- */}
            { (usuario.rol === 'admin' || usuario.rol === 'voluntarios') && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}> 
                    <button 
                        className="btn-agregar-benefactor btn-secundario" 
                        onClick={onAbrirListaVoluntarios} 
                    >
                        <IoPeopleOutline /> Ver Lista Voluntarios
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirVoluntario} 
                    >
                        <IoAddCircleOutline /> Nuevo Voluntario
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
                        <RiFileList3Line /> Ver Lista Benefactores
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirFormulario} 
                    >
                        <IoAddCircleOutline /> Agregar Benefactor
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
                        <LuTruck /> Ver Flota
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirVehiculo} 
                    >
                        <IoAddCircleOutline /> Nuevo Vehículo
                    </button>
                </div>
            )}

            {/* --- GRUPO 4: BOTONES INVENTARIO --- */}
            { (usuario.rol === 'admin' || usuario.rol === 'inventario') && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                        className="btn-agregar-benefactor btn-secundario" 
                        onClick={onAbrirListaInventario} 
                    >
                        <MdOutlineInventory2 /> Ver Inventario
                    </button>

                    <button 
                        className="btn-agregar-benefactor" 
                        onClick={onAbrirInventario} 
                    >
                        <IoAddCircleOutline /> Nuevo Item
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

          {/* Módulo Inventario (¡NUEVO!) */}
          { (usuario.rol === 'admin' || usuario.rol === 'inventario') && (
            <InventarioResumen key={refreshInventario} />
          )}
          
        </div>
      </main>
    </>
  );
}

export default DashboardPage;