import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
// Reutilizamos el CSS del formulario de benefactores para mantener consistencia visual
import '../../assets/styles/BenefactorForm.css'; 

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
      // Helper para evitar errores con fechas nulas
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
      };
      
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
    // La placa siempre en mayúsculas
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
      
      if (onSuccess) onSuccess(); 
      else window.location.reload();
      
      onClose();

    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
      <div className="modal-overlay">
          {/* Usamos modal-content, pero limitamos un poco el ancho ya que este form es pequeño */}
          <div className="modal-content" style={{ maxWidth: '500px' }}>
              
              <div className="modal-header"> 
                  <h2>{vehiculoToEdit ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              {/* Reutilizamos la clase benefactor-form-grid pero forzamos 1 columna por ser pocos datos */}
              <form onSubmit={handleSubmit} className="benefactor-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  
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
                        disabled={!!vehiculoToEdit} // Bloqueamos placa si es edición (opcional, por seguridad)
                      />
                  </div>

                  <div className="form-group">
                      <label>Descripción / Modelo</label>
                      <input 
                        type="text" 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                      />
                  </div>

                  <div className="form-group">
                      <label>Conductor Asignado</label>
                      <input 
                        type="text" 
                        name="conductor_asignado" 
                        value={formData.conductor_asignado} 
                        onChange={handleChange} 
                      />
                  </div>

                  <hr className="full-width-hr" />
                  <p style={{fontWeight: '600', color: '#4ea526', margin: '0'}}>Vencimientos de Documentos</p>

                  <div className="form-group">
                      <label>SOAT</label>
                      <input 
                        type="date" 
                        name="fecha_vencimiento_soat" 
                        value={formData.fecha_vencimiento_soat} 
                        onChange={handleChange} 
                      />
                  </div>

                  <div className="form-group">
                      <label>Tecnomecánica</label>
                      <input 
                        type="date" 
                        name="fecha_vencimiento_tecnomecanica" 
                        value={formData.fecha_vencimiento_tecnomecanica} 
                        onChange={handleChange} 
                      />
                  </div>

                  <div className="form-group">
                      <label>Licencia de Conducción</label>
                      <input 
                        type="date" 
                        name="fecha_vencimiento_licencia" 
                        value={formData.fecha_vencimiento_licencia} 
                        onChange={handleChange} 
                      />
                  </div>

                  <div className="form-actions full-width">
                      {mensaje && <p className="error-mensaje">{mensaje}</p>}
                      <button type="submit" className="save-button" disabled={cargando}>
                          {cargando ? 'Guardando...' : 'Guardar Vehículo'}
                      </button>
                  </div>

              </form>
          </div>
      </div>
  );
}

export default VehiculoForm;