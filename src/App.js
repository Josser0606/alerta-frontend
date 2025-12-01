import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BenefactorForm from './features/benefactores/BenefactorForm';
import ListaBenefactores from './features/benefactores/ListaBenefactores';
import VehiculoForm from './features/transporte/VehiculoForm';
import ListaVehiculos from './features/transporte/ListaVehiculos'; // Asegúrate de importar esto
import './assets/styles/App.css';

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
  
  // --- 1. ESTADOS DE VISIBILIDAD (MODALES) ---
  const [mostrarFormBenefactor, setMostrarFormBenefactor] = useState(false);
  const [mostrarListaBenefactores, setMostrarListaBenefactores] = useState(false);
  
  const [mostrarFormVehiculo, setMostrarFormVehiculo] = useState(false);
  const [mostrarListaVehiculos, setMostrarListaVehiculos] = useState(false);

  // --- 2. ESTADOS DE EDICIÓN (DATOS) ---
  const [benefactorAEditar, setBenefactorAEditar] = useState(null);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  // --- 3. FUNCIONES MANEJADORAS (HANDLERS) ---

  // Benefactores
  const abrirCrearBenefactor = () => {
      setBenefactorAEditar(null); // Limpiamos para que sea uno nuevo
      setMostrarFormBenefactor(true);
  };

  const abrirEditarBenefactor = (benefactor) => {
    setBenefactorAEditar(benefactor); // Guardamos el que vamos a editar
    setMostrarListaBenefactores(false); // Cerramos la lista
    setMostrarFormBenefactor(true);     // Abrimos el formulario
  };

  // Vehículos
  const abrirCrearVehiculo = () => {
      setVehiculoAEditar(null);
      setMostrarFormVehiculo(true);
  };

  const abrirEditarVehiculo = (vehiculo) => {
    setVehiculoAEditar(vehiculo);
    setMostrarListaVehiculos(false);
    setMostrarFormVehiculo(true);
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
                  // Pasamos las funciones para ABRIR los modales
                  onAbrirFormulario={abrirCrearBenefactor} 
                  onAbrirLista={() => setMostrarListaBenefactores(true)}
                  onAbrirVehiculo={abrirCrearVehiculo}
                  onAbrirListaVehiculos={() => setMostrarListaVehiculos(true)}
                />
                
                {/* --- MODALES FLOTANTES --- */}

                {/* 1. BENEFACTORES: Formulario (Crear o Editar) */}
                {mostrarFormBenefactor && (
                  <BenefactorForm 
                    onClose={() => setMostrarFormBenefactor(false)} 
                    benefactorToEdit={benefactorAEditar}
                    onSuccess={() => {
                        // Opcional: Podrías reabrir la lista aquí si quisieras
                        // setMostrarListaBenefactores(true);
                    }}
                  />
                )}
                
                {/* 2. BENEFACTORES: Lista Completa */}
                {mostrarListaBenefactores && (
                  <ListaBenefactores 
                    onClose={() => setMostrarListaBenefactores(false)} 
                    onEditar={abrirEditarBenefactor} // <--- ¡ESTA LÍNEA FALTABA!
                  />
                )}

                {/* 3. VEHÍCULOS: Formulario */}
                {mostrarFormVehiculo && (
                  <VehiculoForm 
                    onClose={() => setMostrarFormVehiculo(false)} 
                    vehiculoToEdit={vehiculoAEditar}
                  />
                )}

                {/* 4. VEHÍCULOS: Lista Completa */}
                {mostrarListaVehiculos && (
                  <ListaVehiculos 
                    onClose={() => setMostrarListaVehiculos(false)}
                    onEditar={abrirEditarVehiculo}
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