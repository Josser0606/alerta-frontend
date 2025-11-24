import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import BenefactorForm from './BenefactorForm';
import ListaBenefactores from './ListaBenefactores';
import VehiculoForm from './VehiculoForm'; // <--- IMPORTANTE: Importamos el nuevo componente
import './App.css';

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
  
  // --- ESTADOS PARA LOS MODALES ---
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarVehiculo, setMostrarVehiculo] = useState(false); // <--- NUEVO ESTADO

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
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
                  onAbrirFormulario={() => setMostrarFormulario(true)} 
                  onAbrirLista={() => setMostrarLista(true)}
                  onAbrirVehiculo={() => setMostrarVehiculo(true)} // <--- NUEVA FUNCIÓN
                />
                
                {/* --- MODALES FLOTANTES --- */}

                {/* 1. Modal Formulario Agregar Benefactor */}
                {mostrarFormulario && (
                  <BenefactorForm onClose={() => setMostrarFormulario(false)} />
                )}

                {/* 2. Modal Lista Completa Benefactores */}
                {mostrarLista && (
                  <ListaBenefactores onClose={() => setMostrarLista(false)} />
                )}

                {/* 3. Modal Agregar Vehículo (NUEVO) */}
                {mostrarVehiculo && (
                  <VehiculoForm onClose={() => setMostrarVehiculo(false)} />
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