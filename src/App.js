// frontend/src/App.js
import React from 'react';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import './App.css';

// Función auxiliar para obtener los datos del usuario guardados
function getUserData() {
  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  
  if (token && usuarioString) {
    try {
      // Devuelve el objeto de usuario (ej: { nombre: 'Joss', rol: 'admin' })
      return JSON.parse(usuarioString); 
    } catch (e) {
      // Si hay un error (ej. JSON malformado), borra todo
      localStorage.clear();
      return null;
    }
  }
  return null; // No está autenticado
}


function App() {
  
  // 1. Leemos el usuario al cargar la app
  const usuario = getUserData();

  // 2. Creamos la función de Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.reload(); // Recarga la página para volver al Login
  };
  
  // 3. Renderizado condicional
  if (usuario) {
    // Si está logueado, muestra el Dashboard
    // y le pasamos el objeto 'usuario' y la función 'handleLogout'
    return <DashboardPage usuario={usuario} onLogout={handleLogout} />;
  } else {
    // Si NO está logueado, muestra solo la página de Login
    return <LoginPage />;
  }
}

export default App;