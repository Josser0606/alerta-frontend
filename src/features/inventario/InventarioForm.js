import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/BenefactorForm.css'; // Reutilizamos estilos
import { BiError } from "react-icons/bi";

// --- LISTAS DE OPCIONES ---
const CENTROS = ["Medellín", "Rionegro", "Apartadó", "Urrao", "Sonsón"];
const TIPOS_PRODUCTO = ["Computador Portátil", "Computador Escritorio", "Impresora", "Celular", "Tablet", "Periférico", "Mobiliario", "Otro"];
const AREAS = ["Administrativa", "Operativa", "Logística", "Social", "Comercial", "Dirección", "Tecnología"];
const SUB_AREAS = [
    "Recepción", "Talento Humano", "Contabilidad", "Tesorería", "Compras", 
    "Sistemas", "Comunicación", "Trabajo Social", "Nutrición", "Bodega", 
    "Conductores", "Auxiliares", "Calidad", "Seguridad", "Aseo", 
    "Mantenimiento", "Voluntariado", "Proyectos", "Gerencia", "Otro"
];
const CARGOS = ["Director", "Coordinador", "Analista", "Auxiliar", "Operario", "Pasante"];

function InventarioForm({ onClose, itemToEdit, onSuccess }) {
  
  const [formData, setFormData] = useState({
    codigo_serie: '',
    centro_operacion: '',
    area_principal: '', // Ej: Tesorería, Compras (campo abierto o select si prefieres)
    tipo_producto: '',
    descripcion: '',
    area_asignada: '',
    sub_area_asignada: '',
    cargo_asignado: ''
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (mensaje) setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.codigo_serie || !formData.tipo_producto) {
        setMensaje("El código de serie y tipo de producto son obligatorios.");
        return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const url = itemToEdit 
        ? `${API_BASE_URL}/inventario/editar/${itemToEdit.id}`
        : `${API_BASE_URL}/inventario/nuevo`;
      
      const method = itemToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || 'Error al guardar');

      alert('Inventario guardado con éxito');
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
          <div className="modal-content">
              <div className="modal-header"> 
                  <h2>{itemToEdit ? 'Editar Item' : 'Nuevo Item de Inventario'}</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="benefactor-form-grid" noValidate>
                  
                  {/* 1. CÓDIGO DE SERIE */}
                  <div className="form-group">
                      <label>Código de Serie *</label>
                      <input 
                        type="text" name="codigo_serie" 
                        value={formData.codigo_serie} onChange={handleChange} 
                        placeholder="Ej: SN-123456"
                      />
                  </div>

                  {/* 2. CENTRO DE OPERACIÓN */}
                  <div className="form-group">
                      <label>Centro de Operación</label>
                      <select name="centro_operacion" value={formData.centro_operacion} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {CENTROS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 3. AREA PRINCIPAL (Tesorería, Compras...) */}
                  <div className="form-group">
                      <label>Área Específica (Ej: Compras)</label>
                      <input 
                        type="text" name="area_principal" 
                        value={formData.area_principal} onChange={handleChange} 
                        placeholder="Ej: Tesorería"
                      />
                  </div>

                  {/* 4. TIPO PRODUCTO */}
                  <div className="form-group">
                      <label>Tipo de Producto *</label>
                      <select name="tipo_producto" value={formData.tipo_producto} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {TIPOS_PRODUCTO.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 5. DESCRIPCIÓN */}
                  <div className="form-group full-width">
                      <label>Descripción del Item</label>
                      <textarea 
                        name="descripcion" 
                        value={formData.descripcion} onChange={handleChange} 
                        placeholder="Marca, modelo, color, estado..."
                      />
                  </div>

                  <div className="full-width-hr"></div>

                  {/* 6. ÁREA ASIGNADA */}
                  <div className="form-group">
                      <label>Área General</label>
                      <select name="area_asignada" value={formData.area_asignada} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {AREAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 7. SUB-ÁREA ASIGNADA */}
                  <div className="form-group">
                      <label>Sub-Área</label>
                      <select name="sub_area_asignada" value={formData.sub_area_asignada} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {SUB_AREAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 8. CARGO */}
                  <div className="form-group">
                      <label>Cargo Responsable</label>
                      <select name="cargo_asignado" value={formData.cargo_asignado} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {CARGOS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  <div className="form-actions full-width">
                      {mensaje && (
                          <div className="error-mensaje"><BiError /> <span>{mensaje}</span></div>
                      )}
                      <button type="submit" className="save-button" disabled={cargando}>
                          {cargando ? 'Guardando...' : 'Guardar Item'}
                      </button>
                  </div>

              </form>
          </div>
      </div>
  );
}

export default InventarioForm;