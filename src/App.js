// frontend/src/App.js

import React, { useState } from 'react';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import BenefactorForm from './BenefactorForm'; // Importa el formulario aquí
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

  // Mueve el estado del modal aquí
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.reload(); 
  };
  
  // Renderizado condicional
  if (usuario) {
    // Si está logueado, muestra el Dashboard Y el Modal (si está activo)
    return (
      <div className="App">
        <DashboardPage 
          usuario={usuario} 
          onLogout={handleLogout} 
          // Pasamos la función para ABRIR el modal
          onAbrirFormulario={() => setMostrarFormulario(true)} 
        />
        
        {/* El modal ahora vive aquí, en el nivel superior */}
        {mostrarFormulario && (
          <BenefactorForm onClose={() => setMostrarFormulario(false)} />
        )}
      </div>
    );
  } else {
    // Si NO está logueado, muestra solo la página de Login
    return <LoginPage />;
  }
}

export default App;