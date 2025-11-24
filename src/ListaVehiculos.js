import React, { useEffect, useState } from 'react';
import API_BASE_URL from './apiConfig';
import './App.css';

const ListaVehiculos = ({ onClose, onEditar }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
        // Llamamos a la ruta /todos con parámetro de búsqueda
        const response = await fetch(`${API_BASE_URL}/transporte/todos?search=${encodeURIComponent(busqueda)}`);
        const data = await response.json();
        setVehiculos(data);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, [busqueda]); // Recargar al buscar

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        <div className="modal-header" style={{backgroundColor: '#5bc0de'}}>
          <h2>🚗 Gestión de Flota</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <input 
            type="text" 
            placeholder="🔍 Buscar por placa o descripción..." 
            className="barra-busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />

          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Cargando flota...</div>
          ) : (
            <div className="tabla-container">
              <table className="tabla-benefactores">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Descripción</th>
                    <th>Conductor</th>
                    <th>SOAT</th>
                    <th>Tecno</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.length > 0 ? (
                    vehiculos.map((v) => (
                      <tr key={v.id || v.placa}>
                        <td><strong>{v.placa}</strong></td>
                        <td>{v.descripcion}</td>
                        <td>{v.conductor_asignado}</td>
                        <td>{v.fecha_vencimiento_soat ? v.fecha_vencimiento_soat.split('T')[0] : '-'}</td>
                        <td>{v.fecha_vencimiento_tecnomecanica ? v.fecha_vencimiento_tecnomecanica.split('T')[0] : '-'}</td>
                        <td>
                          <button 
                            className="btn-volver" 
                            style={{fontSize: '0.8em', padding: '5px 10px'}}
                            onClick={() => onEditar(v)}
                          >
                            ✏️ Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No hay vehículos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaVehiculos;