import React, { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/Listas.css'; 
import { IoCarOutline } from "react-icons/io5";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa"; // Importamos el ícono de basura

const ListaVehiculos = ({ onClose, onEditar }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // --- CARGAR DATOS ---
  const fetchVehiculos = useCallback(async () => {
    setLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/transporte/todos?search=${encodeURIComponent(busqueda)}`);
        if (!response.ok) throw new Error('Error al cargar vehículos');
        
        const data = await response.json();
        setVehiculos(data);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
  }, [busqueda]);

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  // --- NUEVA FUNCIÓN: ELIMINAR ---
  const handleDelete = async (id, placa) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el vehículo con placa "${placa}"?\nEsta acción no se puede deshacer.`);
    
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_BASE_URL}/transporte/eliminar/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.mensaje || "Error al eliminar");
        }

        // Actualizar lista visualmente
        setVehiculos(prev => prev.filter(v => v.id !== id));
        alert("Vehículo eliminado correctamente.");

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al intentar eliminar.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IoCarOutline /> Gestión de Vehículos
          </h2>
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
                    <th style={{textAlign: 'center'}}>Acciones</th>
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
                        
                        {/* Columna de Acciones con ambos botones */}
                        <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button 
                            className="btn-volver" 
                            style={{ background: '#46a022', padding: '8px 12px', fontSize: '0.9em' }}
                            onClick={() => onEditar(v)}
                            title="Editar Vehículo"
                          >
                            <FaRegEdit />
                          </button>

                          <button 
                            className="btn-volver"
                            style={{ background: '#d9534f', padding: '8px 12px', fontSize: '0.9em' }}
                            onClick={() => handleDelete(v.id, v.placa)}
                            title="Eliminar Vehículo"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No hay vehículos registrados.</td></tr>
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