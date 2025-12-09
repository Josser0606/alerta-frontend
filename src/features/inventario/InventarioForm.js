import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/BenefactorForm.css'; 
import { BiError } from "react-icons/bi";

// --- LISTAS DE OPCIONES ---

const CATEGORIAS = [
    { codigo: 'TE', nombre: 'Terrenos' },
    { codigo: 'COE', nombre: 'Construcciones y Edificios' },
    { codigo: 'MAE', nombre: 'Maquinaria y Equipo' },
    { codigo: 'EQO', nombre: 'Equipos y Oficina' },
    { codigo: 'ECOM', nombre: 'Equipo de Computación y Comunicación' },
    { codigo: 'FLT', nombre: 'Flota y Equipo de Transporte' }
];
const CENTROS = ["Medellín", "Rionegro", "Apartadó", "Urrao", "Sonsón", "Templos comedores"];
const TIPOS_PRODUCTO = ["Computador Portátil", "Computador de Escritorio", "Monitor", "Sillas", "Tablet", "Periférico", "Mobiliario", "Otro"];
const AREAS = ["Administrativa", "Operativa", "Logística", "Social", "Comercial", "Dirección", "Tecnología"];
const SUB_AREAS = [
    "Recepción", "Contabilidad", "Seguridad y salud ", "Tesorería", "Compras", 
    "Sistemas", "Comunicación", "Trabajo Social", "Nutrición", "Mantenimiento de vihiculos", "Alistamiento", "Inventario", "Clasificación", 
    "Calidad", "Subasta", "Reagro", "Templos Comedores", "Alimentación Preparada", "Otros"
];
const CARGOS = ["Director", "Coordinador", "Lider", "Auxiliar", "Operario", "Practicante"];

// --- AQUÍ AGREGAMOS "Inactivo" ---
const ESTADOS = ["Sin Prioridad", "Con Prioridad", "Inactivo"];

function InventarioForm({ onClose, itemToEdit, onSuccess }) {
  
  const [formData, setFormData] = useState({
    categoria: '', 
    codigo_serie: '', 
    centro_operacion: '',
    area_principal: '', 
    tipo_producto: [], 
    descripcion: '',
    area_asignada: '',
    sub_area_asignada: '',
    cargo_asignado: '',
    estado: 'Sin Prioridad'
  });

  const [cargando, setCargando] = useState(false);
  const [calculandoCodigo, setCalculandoCodigo] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // 1. CARGAR DATOS SI ESTAMOS EDITANDO
  useEffect(() => {
    if (itemToEdit) {
      let tiposArray = [];
      if (itemToEdit.tipo_producto) {
          tiposArray = Array.isArray(itemToEdit.tipo_producto) 
              ? itemToEdit.tipo_producto 
              : itemToEdit.tipo_producto.split(', ');
      }
      
      setFormData({
          ...itemToEdit,
          tipo_producto: tiposArray,
          estado: itemToEdit.estado || 'Sin Prioridad'
      });
    }
  }, [itemToEdit]);

  // 2. CALCULAR CÓDIGO AUTOMÁTICO
  useEffect(() => {
    if (!itemToEdit && formData.categoria) {
        const obtenerSiguienteCodigo = async () => {
            setCalculandoCodigo(true);
            try {
                const response = await fetch(`${API_BASE_URL}/inventario/siguiente-codigo/${formData.categoria}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setFormData(prev => ({ ...prev, codigo_serie: data.siguienteCodigo }));
                } else {
                    setFormData(prev => ({ ...prev, codigo_serie: "Error al calcular" }));
                }
            } catch (error) {
                console.error("Error obteniendo código:", error);
                setFormData(prev => ({ ...prev, codigo_serie: "Error de conexión" }));
            } finally {
                setCalculandoCodigo(false);
            }
        };
        obtenerSiguienteCodigo();
    } else if (!itemToEdit && !formData.categoria) {
        setFormData(prev => ({ ...prev, codigo_serie: '' }));
    }
  }, [formData.categoria, itemToEdit]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (mensaje) setMensaje('');
  };

  const handleTipoProductoChange = (tipo) => {
      setFormData(prev => {
          const currentTypes = [...prev.tipo_producto];
          if (currentTypes.includes(tipo)) {
              return { ...prev, tipo_producto: currentTypes.filter(t => t !== tipo) };
          } else {
              return { ...prev, tipo_producto: [...currentTypes, tipo] };
          }
      });
      if (mensaje) setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemToEdit && !formData.categoria) {
        setMensaje("Debe seleccionar una categoría para generar el código.");
        return;
    }
    
    if (formData.tipo_producto.length === 0) {
        setMensaje("Debe seleccionar al menos un tipo de producto.");
        return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const url = itemToEdit 
        ? `${API_BASE_URL}/inventario/editar/${itemToEdit.id}`
        : `${API_BASE_URL}/inventario/nuevo`;
      
      const method = itemToEdit ? 'PUT' : 'POST';

      const dataToSend = {
          ...formData,
          tipo_producto: formData.tipo_producto.join(', ') 
      };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || 'Error al guardar');

      const codigoFinal = data.mensaje.split('Código: ')[1] || formData.codigo_serie;
      const msgExito = itemToEdit 
          ? 'Item actualizado correctamente' 
          : `Item creado con éxito. Código asignado: ${codigoFinal}`;

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

  // Color dinámico para el select de estado
  const getColorEstado = (estado) => {
      if (estado === 'Con Prioridad') return '#d9534f';
      if (estado === 'Inactivo') return '#6c757d'; // Gris para inactivo
      return '#333';
  };

  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <div className="modal-header"> 
                  <h2>{itemToEdit ? 'Editar Item' : 'Nuevo Item de Inventario'}</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="benefactor-form-grid" noValidate>
                  
                  {/* CATEGORÍA */}
                  <div className="form-group">
                      <label>Categoría (Define el Código) *</label>
                      <select 
                        name="categoria" 
                        value={formData.categoria} 
                        onChange={handleChange}
                        disabled={!!itemToEdit} 
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

                  {/* CÓDIGO DE SERIE */}
                  <div className="form-group">
                      <label>Código de Serie</label>
                      <input 
                        type="text" 
                        name="codigo_serie" 
                        value={
                            calculandoCodigo ? "Calculando..." : 
                            (formData.codigo_serie || "Seleccione categoría...")
                        } 
                        readOnly 
                        disabled
                        style={{ 
                            backgroundColor: '#e9ecef', 
                            fontWeight: 'bold', 
                            color: calculandoCodigo ? '#999' : '#333',
                            border: formData.codigo_serie && !calculandoCodigo ? '1px solid #4ea526' : '1px solid #ccc'
                        }}
                      />
                      {!itemToEdit && formData.codigo_serie && !calculandoCodigo && (
                          <small style={{color: '#4ea526', display:'block', marginTop:'4px'}}>
                              ✓ Código disponible
                          </small>
                      )}
                  </div>

                  {/* CENTRO DE OPERACIÓN */}
                  <div className="form-group">
                      <label>Centro de Operación</label>
                      <select name="centro_operacion" value={formData.centro_operacion} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {CENTROS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* ÁREA PRINCIPAL */}
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
                          <label>Nombre de la persona (Ej: Manuela)</label>
                          <input 
                            type="text" name="area_principal" 
                            value={formData.area_principal} onChange={handleChange} 
                            placeholder="Ej: Tesorería"
                          />
                      </div>
                  )}

                  {/* TIPO PRODUCTO */}
                  <div className="form-group full-width">
                      <label>Tipo de Producto (Seleccione uno o varios) *</label>
                      <div className="checkbox-grid">
                          {TIPOS_PRODUCTO.map(tipo => (
                              <label key={tipo} className="checkbox-label">
                                  <input 
                                    type="checkbox" 
                                    checked={formData.tipo_producto.includes(tipo)}
                                    onChange={() => handleTipoProductoChange(tipo)}
                                  />
                                  {tipo}
                              </label>
                          ))}
                      </div>
                  </div>

                  {/* DESCRIPCIÓN */}
                  <div className="form-group full-width">
                      <label>Descripción del Item</label>
                      <textarea 
                        name="descripcion" 
                        value={formData.descripcion} onChange={handleChange} 
                        placeholder="Marca, modelo, color, estado..."
                      />
                  </div>

                  <div className="full-width-hr"></div>

                  {/* ÁREA ASIGNADA */}
                  <div className="form-group">
                      <label>Área General</label>
                      <select name="area_asignada" value={formData.area_asignada} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {AREAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* SUB-ÁREA */}
                  <div className="form-group">
                      <label>Sub-Área</label>
                      <select name="sub_area_asignada" value={formData.sub_area_asignada} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {SUB_AREAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* CARGO */}
                  <div className="form-group">
                      <label>Cargo Responsable</label>
                      <select name="cargo_asignado" value={formData.cargo_asignado} onChange={handleChange}>
                          <option value="">Seleccione...</option>
                          {CARGOS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  {/* ESTADO */}
                  <div className="form-group">
                      <label>Estado / Prioridad</label>
                      <select 
                        name="estado" 
                        value={formData.estado} 
                        onChange={handleChange}
                        style={{ fontWeight: '600', color: getColorEstado(formData.estado) }}
                      >
                          {ESTADOS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                  </div>

                  <div className="form-actions full-width">
                      {mensaje && (
                          <div className="error-mensaje">
                              <BiError /> 
                              <span>{mensaje}</span>
                          </div>
                      )}
                      <button type="submit" className="save-button" disabled={cargando || calculandoCodigo}>
                          {cargando ? 'Guardando...' : (itemToEdit ? 'Actualizar Item' : 'Generar Item')}
                      </button>
                  </div>

              </form>
          </div>
      </div>
  );
}

export default InventarioForm;