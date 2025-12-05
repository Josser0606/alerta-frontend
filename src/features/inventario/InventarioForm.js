import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/BenefactorForm.css'; // Reutilizamos estilos del modal
import { BiError } from "react-icons/bi";

// --- LISTAS DE OPCIONES ---

// CATEGORÍAS PARA CÓDIGO DE SERIE (Define el prefijo)
const CATEGORIAS = [
    { codigo: 'TE', nombre: 'Terrenos' },
    { codigo: 'COE', nombre: 'Construcciones y Edificios' },
    { codigo: 'MAE', nombre: 'Maquinaria y Equipo' },
    { codigo: 'EQO', nombre: 'Equipos y Oficina' },
    { codigo: 'ECOM', nombre: 'Equipo de Computación y Comunicación' },
    { codigo: 'FLT', nombre: 'Flota y Equipo de Transporte' }
];

// CENTROS DE OPERACIÓN
const CENTROS = ["Medellín", "Rionegro", "Apartadó", "Urrao", "Sonsón", "Templos comedores"];

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
    categoria: '', // Nuevo campo para el prefijo (ej: FLT)
    codigo_serie: '', // Se llena solo al editar, o es automático al crear
    centro_operacion: '',
    area_principal: '', 
    tipo_producto: '',
    descripcion: '',
    area_asignada: '',
    sub_area_asignada: '',
    cargo_asignado: ''
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Cargar datos si estamos editando
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

    // Validación diferente según si es nuevo o edición
    if (!itemToEdit && !formData.categoria) {
        setMensaje("Debe seleccionar una categoría para generar el código.");
        return;
    }
    
    if (!formData.tipo_producto) {
        setMensaje("El tipo de producto es obligatorio.");
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

      // Mensaje personalizado según si creó o editó
      // Si el backend devuelve "Item registrado con éxito. Código: FLT0001", lo mostramos
      const msgExito = itemToEdit 
          ? 'Item actualizado correctamente' 
          : (data.mensaje || 'Item creado con éxito');

      alert(msgExito);
      
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
                  
                  {/* 1. CATEGORÍA (Vital para el código automático) */}
                  <div className="form-group">
                      <label>Categoría (Define el Código) *</label>
                      <select 
                        name="categoria" 
                        value={formData.categoria} 
                        onChange={handleChange}
                        disabled={!!itemToEdit} // Bloqueado al editar para no cambiar el código
                        style={{ backgroundColor: itemToEdit ? '#e9ecef' : 'white' }}
                      >
                          <option value="">Seleccione Categoría...</option>
                          {CATEGORIAS.map(cat => (
                              <option key={cat.codigo} value={cat.codigo}>
                                  {cat.nombre} ({cat.codigo})
                              </option>
                          ))}
                      </select>
                  </div>

                  {/* 2. CÓDIGO DE SERIE (Automático o Lectura) */}
                  <div className="form-group">
                      <label>Código de Serie</label>
                      <input 
                        type="text" 
                        name="codigo_serie" 
                        // Muestra el código real si editamos, o el prefijo + XXXX si es nuevo
                        value={itemToEdit ? formData.codigo_serie : (formData.categoria ? `${formData.categoria}XXXX` : "Seleccione categoría...")} 
                        readOnly 
                        disabled
                        style={{ backgroundColor: '#e9ecef', fontWeight: 'bold', color: '#555' }}
                        placeholder="Generación Automática"
                      />
                      {!itemToEdit && <small style={{color: '#4ea526'}}>* Se generará automáticamente (Ej: FLT0001)</small>}
                  </div>

                  {/* 3. CENTRO DE OPERACIÓN */}
                  <div className="form-group">
                      <label>Centro de Operación</label>
                      <select name="centro_operacion" value={formData.centro_operacion} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {CENTROS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 4. ÁREA PRINCIPAL (CONDICIONAL) */}
                  {/* Lógica: Si selecciona 'Templos comedores', mostramos el input especial */}
                  
                  {formData.centro_operacion === 'Templos comedores' ? (
                      <div className="form-group">
                          <label>Nombre del Templo Comedor</label>
                          <input 
                            type="text" name="area_principal" 
                            value={formData.area_principal} onChange={handleChange} 
                            placeholder="Ej: Vallejuelos"
                          />
                      </div>
                  ) : (
                      <div className="form-group">
                          <label>Área Específica (Ej: Compras)</label>
                          <input 
                            type="text" name="area_principal" 
                            value={formData.area_principal} onChange={handleChange} 
                            placeholder="Ej: Tesorería"
                          />
                      </div>
                  )}

                  {/* 5. TIPO PRODUCTO */}
                  <div className="form-group">
                      <label>Tipo de Producto *</label>
                      <select name="tipo_producto" value={formData.tipo_producto} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {TIPOS_PRODUCTO.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 6. DESCRIPCIÓN */}
                  <div className="form-group full-width">
                      <label>Descripción del Item</label>
                      <textarea 
                        name="descripcion" 
                        value={formData.descripcion} onChange={handleChange} 
                        placeholder="Marca, modelo, color, estado..."
                      />
                  </div>

                  <div className="full-width-hr"></div>

                  {/* 7. ÁREA ASIGNADA */}
                  <div className="form-group">
                      <label>Área General</label>
                      <select name="area_asignada" value={formData.area_asignada} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {AREAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 8. SUB-ÁREA ASIGNADA */}
                  <div className="form-group">
                      <label>Sub-Área</label>
                      <select name="sub_area_asignada" value={formData.sub_area_asignada} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {SUB_AREAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* 9. CARGO */}
                  <div className="form-group">
                      <label>Cargo Responsable</label>
                      <select name="cargo_asignado" value={formData.cargo_asignado} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {CARGOS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  <div className="form-actions full-width">
                      {mensaje && (
                          <div className="error-mensaje">
                              <BiError /> 
                              <span>{mensaje}</span>
                          </div>
                      )}
                      <button type="submit" className="save-button" disabled={cargando}>
                          {cargando ? 'Guardando...' : (itemToEdit ? 'Actualizar Item' : 'Generar Item')}
                      </button>
                  </div>

              </form>
          </div>
      </div>
  );
}

export default InventarioForm;