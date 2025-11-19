// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import BenefactorForm from './BenefactorForm';
import ListaBenefactores from '.ListaBenefactores'; // Importa el componente
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
  
  // ESTADOS PARA LOS MODALES
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false); // <--- NUEVO ESTADO

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
                  onAbrirLista={() => setMostrarLista(true)} // <--- NUEVA FUNCIÓN
                />
                
                {/* --- MODALES FLOTANTES --- */}

                {/* 1. Modal Formulario Agregar */}
                {mostrarFormulario && (
                  <BenefactorForm onClose={() => setMostrarFormulario(false)} />
                )}

                {/* 2. Modal Lista Completa (NUEVO) */}
                {mostrarLista && (
                  <ListaBenefactores onClose={() => setMostrarLista(false)} />
                )}

              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          {/* Ya no necesitamos la ruta /benefactores/lista porque ahora es un modal */}
          <Route path="*" element={<Navigate to={usuario ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;