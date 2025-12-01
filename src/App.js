import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. IMPORTACIONES DE ESTILOS Y PÁGINAS ---
import './assets/styles/App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// --- 2. IMPORTACIONES DE FEATURES (Módulos) ---

// Módulo Benefactores
import BenefactorForm from './features/benefactores/BenefactorForm';
import ListaBenefactores from './features/benefactores/ListaBenefactores';

// Módulo Transporte
import VehiculoForm from './features/transporte/VehiculoForm';
import ListaVehiculos from './features/transporte/ListaVehiculos';

// Módulo Voluntarios (¡NUEVO!)
import VoluntarioForm from './features/voluntarios/VoluntarioForm';
import ListaVoluntarios from './features/voluntarios/ListaVoluntarios';

// Helper para obtener usuario
function getUserData() {
  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  if (token && usuarioString) {
    try { return JSON.parse(usuarioString); } catch (e) { localStorage.clear(); return null; }
  }
  return null;
}

function App() {
  const usuario = getUserData();
  
  // --- A. ESTADOS DE VISIBILIDAD (MODALES) ---
  
  // Benefactores
  const [mostrarFormBenefactor, setMostrarFormBenefactor] = useState(false);
  const [mostrarListaBenefactores, setMostrarListaBenefactores] = useState(false);
  const [benefactorAEditar, setBenefactorAEditar] = useState(null);

  // Transporte
  const [mostrarFormVehiculo, setMostrarFormVehiculo] = useState(false);
  const [mostrarListaVehiculos, setMostrarListaVehiculos] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);

  // Voluntarios (¡NUEVO!)
  const [mostrarFormVoluntario, setMostrarFormVoluntario] = useState(false);
  const [mostrarListaVoluntarios, setMostrarListaVoluntarios] = useState(false);
  const [voluntarioAEditar, setVoluntarioAEditar] = useState(null);

  // --- B. FUNCIONES DEL SISTEMA ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  // --- C. HANDLERS (Manejadores de Apertura) ---

  // 1. Benefactores
  const abrirCrearBenefactor = () => {
      setBenefactorAEditar(null); 
      setMostrarFormBenefactor(true);
  };

  const abrirEditarBenefactor = (benefactor) => {
    setBenefactorAEditar(benefactor); 
    setMostrarListaBenefactores(false); 
    setMostrarFormBenefactor(true);     
  };

  // 2. Transporte
  const abrirCrearVehiculo = () => {
      setVehiculoAEditar(null);
      setMostrarFormVehiculo(true);
  };

  const abrirEditarVehiculo = (vehiculo) => {
    setVehiculoAEditar(vehiculo);
    setMostrarListaVehiculos(false);
    setMostrarFormVehiculo(true);
  };

  // 3. Voluntarios (¡NUEVO!)
  const abrirCrearVoluntario = () => {
      setVoluntarioAEditar(null);
      setMostrarFormVoluntario(true);
  };

  const abrirEditarVoluntario = (voluntario) => {
      setVoluntarioAEditar(voluntario);
      setMostrarListaVoluntarios(false); // Cerramos lista
      setMostrarFormVoluntario(true);    // Abrimos formulario
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!usuario ? <LoginPage /> : <Navigate to="/" />} />

          <Route path="/" element={
            usuario ? (
              <>
                <DashboardPage 
                  usuario={usuario} 
                  onLogout={handleLogout} 
                  
                  // Conexión Benefactores
                  onAbrirFormulario={abrirCrearBenefactor} 
                  onAbrirLista={() => setMostrarListaBenefactores(true)}
                  
                  // Conexión Transporte
                  onAbrirVehiculo={abrirCrearVehiculo}
                  onAbrirListaVehiculos={() => setMostrarListaVehiculos(true)}

                  // Conexión Voluntarios (¡NUEVO!)
                  onAbrirVoluntario={abrirCrearVoluntario}
                  onAbrirListaVoluntarios={() => setMostrarListaVoluntarios(true)}
                />
                
                {/* --- MODALES FLOTANTES --- */}

                {/* 1. BENEFACTORES */}
                {mostrarFormBenefactor && (
                  <BenefactorForm 
                    onClose={() => setMostrarFormBenefactor(false)} 
                    benefactorToEdit={benefactorAEditar}
                    onSuccess={() => { /* Opcional: Recargar algo si se requiere */ }}
                  />
                )}
                {mostrarListaBenefactores && (
                  <ListaBenefactores 
                    onClose={() => setMostrarListaBenefactores(false)} 
                    onEditar={abrirEditarBenefactor} 
                  />
                )}

                {/* 2. TRANSPORTE */}
                {mostrarFormVehiculo && (
                  <VehiculoForm 
                    onClose={() => setMostrarFormVehiculo(false)} 
                    vehiculoToEdit={vehiculoAEditar}
                  />
                )}
                {mostrarListaVehiculos && (
                  <ListaVehiculos 
                    onClose={() => setMostrarListaVehiculos(false)}
                    onEditar={abrirEditarVehiculo}
                  />
                )}

                {/* 3. VOLUNTARIOS (¡NUEVO!) */}
                {mostrarFormVoluntario && (
                  <VoluntarioForm 
                    onClose={() => setMostrarFormVoluntario(false)}
                    voluntarioToEdit={voluntarioAEditar}
                  />
                )}
                {mostrarListaVoluntarios && (
                  <ListaVoluntarios 
                    onClose={() => setMostrarListaVoluntarios(false)}
                    onEditar={abrirEditarVoluntario}
                  />
                )}

              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="*" element={<Navigate to={usuario ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;