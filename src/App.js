// En tu archivo App.js
import React from 'react';
import AlertasCumpleanos from './AlertasCumpleanos'; // Asegúrate de que la ruta sea correcta
import ProximosCumpleanos from './ProximosCumpleanos';
import './App.css';

function App() {
  return (
    <>
    <img src="/logo_saciar.png" alt="Logo de la aplicación" className="logo-standalone" /> 
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Alertas</h1>
        
        {/* ▼ ESTE ES EL NUEVO CONTENEDOR QUE AÑADIMOS ▼ */}
        <div className="cards-container">

          {/* Tus dos componentes van DENTRO del nuevo contenedor */}
          <AlertasCumpleanos />
          <ProximosCumpleanos />

        </div>
        {/* ▲ FIN DEL NUEVO CONTENEDOR ▲ */}

      </header>
    </div>
    </>
  );
}

export default App;