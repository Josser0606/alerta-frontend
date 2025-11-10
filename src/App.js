// En tu archivo App.js
import React from 'react';
import AlertasCumpleanos from './AlertasCumpleanos'; // Asegúrate de que la ruta sea correcta
import ProximosCumpleanos from './ProximosCumpleanos';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Sistema de Alertas</h1>
        
        {/* Aquí pones tu componente de alertas */}
        <AlertasCumpleanos />

        {/* 2. Componente para PRÓXIMOS (opcional) */}
        <ProximosCumpleanos />

      </header>
    </div>
  );
}

export default App;