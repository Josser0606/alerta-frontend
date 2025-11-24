import React, { useState, useEffect } from 'react';
import API_BASE_URL from './apiConfig';
import './App.css';

// Recibimos 'vehiculoToEdit' (puede ser null) y 'onSuccess' para recargar la lista sin F5
function VehiculoForm({ onClose, vehiculoToEdit, onSuccess }) {
  
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

  // EFECTO: Si viene un vehículo para editar, llenamos el formulario
  useEffect(() => {
    if (vehiculoToEdit) {
      // Formateamos las fechas para que el input type="date" las lea (YYYY-MM-DD)
      const formatDate = (dateStr) => dateStr ? dateStr.split('T')[0] : '';
      
      setFormData({
        placa: vehiculoToEdit.placa,
        descripcion: vehiculoToEdit.descripcion || '',
        conductor_asignado: vehiculoToEdit.conductor_asignado || '',
        fecha_vencimiento_soat: formatDate(vehiculoToEdit.fecha_vencimiento_soat),
        fecha_vencimiento_tecnomecanica: formatDate(vehiculoToEdit.fecha_vencimiento_tecnomecanica),
        fecha_vencimiento_licencia: formatDate(vehiculoToEdit.fecha_vencimiento_licencia)
      });
    }
  }, [vehiculoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const valorFinal = name === 'placa' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: valorFinal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const url = vehiculoToEdit 
        ? `${API_BASE_URL}/transporte/editar/${vehiculoToEdit.id}`
        : `${API_BASE_URL}/transporte/nuevo`;
      
      const method = vehiculoToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || 'Error al guardar');

      alert(vehiculoToEdit ? 'Vehículo actualizado' : 'Vehículo registrado');
      
      if (onSuccess) onSuccess(); // Recargar lista si existe la función
      else window.location.reload(); // Fallback clásico
      
      onClose();

    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
      <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header" style={{ backgroundColor: '#5bc0de' }}> 
                  <h2>{vehiculoToEdit ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="benefactor-form-grid" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="form-group">
                      <label>Placa *</label>
                      <input 
                        type="text" name="placa" value={formData.placa} onChange={handleChange} 
                        required maxLength="6" placeholder="AAA123"
                        // Si estamos editando, quizás no queramos dejar cambiar la placa fácilmente, pero lo dejaré abierto
                      />
                  </div>
                  <div className="form-group">
                      <label>Descripción / Modelo</label>
                      <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} />
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
                      <label>Vencimiento Licencia</label>
                      <input type="date" name="fecha_vencimiento_licencia" value={formData.fecha_vencimiento_licencia} onChange={handleChange} />
                  </div>
                  <div className="form-actions full-width">
                      {mensaje && <p className="error-mensaje">{mensaje}</p>}
                      <button type="submit" className="save-button" disabled={cargando} style={{ background: '#5bc0de' }}>
                          {cargando ? 'Guardando...' : 'Guardar Vehículo'}
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );
}

export default VehiculoForm;