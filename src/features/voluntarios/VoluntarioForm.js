import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/BenefactorForm.css'; // Reutilizamos estilos

function VoluntarioForm({ onClose, voluntarioToEdit, onSuccess }) {
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    fecha_nacimiento: '',
    telefono: '',
    correo: '',
    estado: 'Activo'
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (voluntarioToEdit) {
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
      };

      setFormData({
        nombre_completo: voluntarioToEdit.nombre_completo || '',
        fecha_nacimiento: formatDate(voluntarioToEdit.fecha_nacimiento),
        telefono: voluntarioToEdit.telefono || '',
        correo: voluntarioToEdit.correo || '',
        estado: voluntarioToEdit.estado || 'Activo'
      });
    }
  }, [voluntarioToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const url = voluntarioToEdit 
        ? `${API_BASE_URL}/voluntarios/editar/${voluntarioToEdit.id}`
        : `${API_BASE_URL}/voluntarios/nuevo`;
      
      const method = voluntarioToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || 'Error al guardar');

      alert(voluntarioToEdit ? 'Voluntario actualizado' : 'Voluntario registrado');
      
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
          <div className="modal-content" style={{ maxWidth: '600px' }}>
              
              <div className="modal-header"> 
                  <h2>{voluntarioToEdit ? 'Editar Voluntario' : 'Nuevo Voluntario'}</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="benefactor-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  
                  <div className="form-group full-width">
                      <label>Nombre Completo *</label>
                      <input 
                        type="text" 
                        name="nombre_completo" 
                        value={formData.nombre_completo} 
                        onChange={handleChange} 
                        required 
                      />
                  </div>

                  <div className="form-group">
                      <label>Fecha de Nacimiento</label>
                      <input 
                        type="date" 
                        name="fecha_nacimiento" 
                        value={formData.fecha_nacimiento} 
                        onChange={handleChange} 
                      />
                  </div>

                  <div className="form-group">
                      <label>Estado</label>
                      <select name="estado" value={formData.estado} onChange={handleChange}>
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>Teléfono</label>
                      <input 
                        type="number" 
                        name="telefono" 
                        value={formData.telefono} 
                        onChange={handleChange} 
                      />
                  </div>

                  <div className="form-group">
                      <label>Correo Electrónico</label>
                      <input 
                        type="email" 
                        name="correo" 
                        value={formData.correo} 
                        onChange={handleChange} 
                      />
                  </div>

                  <div className="form-actions full-width">
                      {mensaje && <p className="error-mensaje">{mensaje}</p>}
                      <button type="submit" className="save-button" disabled={cargando}>
                          {cargando ? 'Guardando...' : 'Guardar Voluntario'}
                      </button>
                  </div>

              </form>
          </div>
      </div>
  );
}

export default VoluntarioForm;