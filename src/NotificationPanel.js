// frontend/src/NotificationPanel.js
import React, { useState, useEffect } from 'react';
import './App.css';

// --- 1. IMPORTAR LA CONFIGURACIÓN DE LA API ---
import API_BASE_URL from './apiConfig';

function NotificationPanel() {
  
  const [counts, setCounts] = useState({ hoy: 0, proximos: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        // --- 2. MODIFICAR LA LÍNEA DEL FETCH ---
        const response = await fetch(`${API_BASE_URL}/cumpleaneros/resumen`);
        // ------------------------------------

        if (!response.ok) {
          throw new Error('Error al cargar resumen');
        }
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    fetchResumen();
  }, []); 

  return (
    <div className="notification-panel">
      <h4>Resumen de Alertas</h4>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <ul className="notification-list">
          <li>
            <span>Cumpleaños Hoy:</span>
            <strong>{counts.hoy}</strong>
          </li>
          <li>
            <span>Próximos (7 días):</span>
            <strong>{counts.proximos}</strong>
          </li>
        </ul>
      )}
    </div>
  );
}

export default NotificationPanel;