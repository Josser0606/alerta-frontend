// frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // <--- 1. IMPORTANTE: Rutas

import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import BenefactorForm from './BenefactorForm';
import ListaBenefactores from './components/ListaBenefactores'; // <--- 2. Importar la nueva lista
import './App.css';

// Función para obtener los datos del usuario
function getUserData() {
  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  
  if (token && usuarioString) {
    try {
      return JSON.parse(usuarioString); 
    } catch (e) {
      localStorage.clear();
      return null;
    }
  }
  return null;
}

function App() {
  const usuario = getUserData();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login'; // Forzamos recarga para limpiar estado
  };

  return (
    // 3. Envolvemos TODA la app en <Router>
    <Router>
      <div className="App">
        <Routes>
          
          {/* RUTA 1: LOGIN */}
          {/* Si ya está logueado, lo mandamos al Dashboard ("/") */}
          <Route 
            path="/login" 
            element={!usuario ? <LoginPage /> : <Navigate to="/" />} 
          />

          {/* RUTA 2: DASHBOARD (PRINCIPAL) */}
          {/* Si NO está logueado, lo mandamos al Login */}
          <Route 
            path="/" 
            element={
              usuario ? (
                <>
                  <DashboardPage 
                    usuario={usuario} 
                    onLogout={handleLogout} 
                    onAbrirFormulario={() => setMostrarFormulario(true)} 
                  />
                  
                  {/* El modal vive aquí, sobre el Dashboard */}
                  {mostrarFormulario && (
                    <BenefactorForm onClose={() => setMostrarFormulario(false)} />
                  )}
                </>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          {/* RUTA 3: NUEVA LISTA DE BENEFACTORES */}
          <Route 
            path="/benefactores/lista" 
            element={
              usuario ? <ListaBenefactores /> : <Navigate to="/login" />
            } 
          />

          {/* RUTA COMODÍN: Cualquier otra cosa redirige al inicio */}
          <Route path="*" element={<Navigate to={usuario ? "/" : "/login"} />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;