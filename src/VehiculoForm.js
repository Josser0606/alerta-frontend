// frontend/src/VehiculoForm.js
import React, { useState } from 'react';
import API_BASE_URL from './apiConfig';
import './App.css';

function VehiculoForm({ onClose }) {
  
  const [formData, setFormData] = useState({
    placa: '',
    descripcion: '',
    conductor_asignado: '',
    fecha_vencimiento_soat: '',
    fecha_vencimiento_tecnomecanica: '',
    fecha_vencimiento_licencia: ''
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertir a mayúsculas la placa automáticamente
    const valorFinal = name === 'placa' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: valorFinal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const response = await fetch(`${API_BASE_URL}/transporte/nuevo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al guardar');
      }

      alert('Vehículo registrado con éxito');
      onClose(); // Cerrar modal
      window.location.reload(); // Recargar para ver la alerta si aplica

    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
      <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header" style={{ backgroundColor: '#5bc0de' }}> {/* Azul Transporte */}
                  <h2>Nuevo Vehículo / Conductor</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="benefactor-form-grid" style={{ display: 'flex', flexDirection: 'column' }}>
                  
                  <div className="form-group">
                      <label>Placa *</label>
                      <input 
                        type="text" 
                        name="placa" 
                        value={formData.placa} 
                        onChange={handleChange} 
                        required 
                        maxLength="6"
                        placeholder="AAA123"
                      />
                  </div>

                  <div className="form-group">
                      <label>Descripción / Modelo</label>
                      <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Ej: Camión Chevrolet NQR" />
                  </div>

                  <div className="form-group">
                      <label>Conductor Asignado</label>
                      <input type="text" name="conductor_asignado" value={formData.conductor_asignado} onChange={handleChange} />
                  </div>

                  <hr className="full-width-hr" />
                  <p style={{fontWeight: 'bold', color: '#555', margin: '0'}}>Fechas de Vencimiento:</p>

                  <div className="form-group">
                      <label>Vencimiento SOAT</label>
                      <input type="date" name="fecha_vencimiento_soat" value={formData.fecha_vencimiento_soat} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                      <label>Vencimiento Tecnomecánica</label>
                      <input type="date" name="fecha_vencimiento_tecnomecanica" value={formData.fecha_vencimiento_tecnomecanica} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                      <label>Vencimiento Licencia Conductor</label>
                      <input type="date" name="fecha_vencimiento_licencia" value={formData.fecha_vencimiento_licencia} onChange={handleChange} />
                  </div>

                  <div className="form-actions full-width">
                      {mensaje && <p className="error-mensaje">{mensaje}</p>}
                      <button 
                        type="submit" 
                        className="save-button" 
                        disabled={cargando}
                        style={{ background: '#5bc0de' }} // Botón azul a juego
                      >
                          {cargando ? 'Guardando...' : 'Guardar Vehículo'}
                      </button>
                  </div>
                  
              </form>
          </div>
      </div>
  );
}

export default VehiculoForm;