// frontend/src/App.js
import React from 'react';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import './App.css';

// Esta función simple revisa si hay un token en el almacenamiento local
function estaAutenticado() {
  const token = localStorage.getItem('token');
  // Podríamos añadir una verificación de que el token no haya expirado,
  // pero por ahora, solo revisamos si existe.
  return token ? true : false;
}


function App() {
  
  // Lógica de renderizado principal
  if (estaAutenticado()) {
    // Si está logueado, muestra el Dashboard completo
    return <DashboardPage />;
  } else {
    // Si NO está logueado, muestra solo la página de Login
    return <LoginPage />;
  }
}

export default App;