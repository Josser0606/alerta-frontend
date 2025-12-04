import React, { useState, useEffect, useRef } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/NotificationPanel.css';

function AlertasBell({ usuario }) {
  const [panelAbierto, setPanelAbierto] = useState(false);
  
  // Estado inicial genérico
  const [datos, setDatos] = useState({ 
      label1: 'Cumpleaños Hoy', value1: 0, 
      label2: 'Próximos', value2: 0 
  });
  
  const [cargando, setCargando] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const fetchResumen = async () => {
      setCargando(true);
      try {
        let endpoint = '';
        let etiquetas = { l1: 'Cumpleaños Hoy', l2: 'Próximos (7 días)' };

        // --- LÓGICA DE ROLES ---
        if (usuario.rol === 'voluntarios') {
           endpoint = `${API_BASE_URL}/voluntarios/resumen`;
           etiquetas = { l1: 'Cumpleaños Hoy', l2: 'Próximos (7 días)' };

        } else if (usuario.rol === 'benefactores') {
           endpoint = `${API_BASE_URL}/benefactores/resumen`;
           // Para benefactores, 'proximos' son los pagos pendientes
           etiquetas = { l1: 'Cumpleaños Hoy', l2: 'Pagos Pendientes' };

        } else if (usuario.rol === 'admin') {
           // El admin por defecto ve voluntarios (o podrías hacer una llamada doble)
           endpoint = `${API_BASE_URL}/voluntarios/resumen`;
           // Podrías crear un endpoint /admin/resumen que sume todo si quisieras
        } else {
           // Si es transporte u otro, por ahora no carga nada
           setCargando(false);
           return;
        }

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Error al cargar resumen');
        
        const data = await response.json();
        
        // Mapeamos la respuesta del backend a nuestro estado local
        // Backend siempre devuelve { hoy: X, proximos: Y }
        setDatos({
            label1: etiquetas.l1,
            value1: data.hoy,
            label2: etiquetas.l2,
            value2: data.proximos
        });

      } catch (error) {
        console.error("Error cargando alertas:", error);
      } finally {
        setCargando(false);
      }
    };

    if (usuario) {
        fetchResumen();
    }
  }, [usuario]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setPanelAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePanel = () => setPanelAbierto(!panelAbierto);

  const rolesPermitidos = ['admin', 'voluntarios', 'benefactores'];
  if (!rolesPermitidos.includes(usuario.rol)) return null;

  // Calculamos si hay alertas para mostrar el puntito rojo
  const hayAlertas = datos.value1 > 0 || datos.value2 > 0;

  return (
    <div className="notification-area" ref={bellRef} style={{ position: 'relative' }}>
      
      <span 
        className="notification-icon" 
        onClick={togglePanel}
        title="Ver Notificaciones"
      >
        <IoNotificationsOutline />
        {hayAlertas && <span className="notification-badge"></span>}
      </span>

      {panelAbierto && (
        <div className="notification-panel">
          <h4>Resumen de Alertas ({usuario.rol})</h4>
          {cargando ? (
            <p style={{ padding: '10px', textAlign: 'center', color: '#666' }}>Cargando...</p>
          ) : (
            <ul className="notification-list">
              <li>
                <span>{datos.label1}:</span>
                <strong>{datos.value1}</strong>
              </li>
              <li>
                <span>{datos.label2}:</span>
                <strong>{datos.value2}</strong>
              </li>
              
              {/* Enlace rápido según rol (Opcional) */}
              <li style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #eee', justifyContent: 'center' }}>
                  <small style={{ color: '#888', fontStyle: 'italic' }}>
                      Ver detalles en el tablero
                  </small>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AlertasBell;