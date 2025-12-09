import React from 'react';
import '../../assets/styles/BenefactorForm.css'; // Reutilizamos estilos del modal
import { IoCloseCircleOutline } from "react-icons/io5";

function InventarioDetalle({ onClose, item }) {
  if (!item) return null;

  return (
      <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
              
              <div className="modal-header"> 
                  <h2>Detalle del Item</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              <div className="benefactor-form-grid" style={{ display: 'block' }}>
                  
                  {/* SECCIÓN 1: IDENTIFICACIÓN */}
                  <h3 className="section-title">Identificación</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                          <label style={{fontWeight:'bold', color:'#555'}}>Código de Serie</label>
                          <p style={{fontSize:'1.2em', margin:'5px 0', color:'#4ea526', fontWeight:'bold'}}>
                              {item.codigo_serie}
                          </p>
                      </div>
                      <div>
                          <label style={{fontWeight:'bold', color:'#555'}}>Categoría</label>
                          <p style={{margin:'5px 0'}}>{item.categoria || '-'}</p>
                      </div>
                  </div>

                  {/* SECCIÓN 2: DESCRIPCIÓN */}
                  <h3 className="section-title">Detalles del Producto</h3>
                  <div style={{ marginBottom: '20px' }}>
                      <label style={{fontWeight:'bold', color:'#555'}}>Tipo de Producto</label>
                      <p style={{margin:'5px 0', padding:'10px', background:'#f9f9f9', borderRadius:'8px'}}>
                          {item.tipo_producto}
                      </p>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                      <label style={{fontWeight:'bold', color:'#555'}}>Descripción Completa</label>
                      <div style={{
                          margin:'5px 0', 
                          padding:'15px', 
                          background:'#f8fafc', 
                          borderRadius:'8px', 
                          border:'1px solid #e2e8f0',
                          whiteSpace: 'pre-wrap' // Para respetar saltos de línea
                      }}>
                          {item.descripcion || "Sin descripción."}
                      </div>
                  </div>

                  {/* SECCIÓN 3: UBICACIÓN */}
                  <h3 className="section-title">Ubicación y Responsable</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                          <label style={{fontWeight:'bold', color:'#555'}}>Centro de Operación</label>
                          <p>{item.centro_operacion}</p>
                      </div>
                      <div>
                          <label style={{fontWeight:'bold', color:'#555'}}>Ubicación Específica</label>
                          <p>{item.area_principal}</p>
                      </div>
                      <div>
                          <label style={{fontWeight:'bold', color:'#555'}}>Área / Sub-área</label>
                          <p>{item.area_asignada} {item.sub_area_asignada ? ` / ${item.sub_area_asignada}` : ''}</p>
                      </div>
                      <div>
                          <label style={{fontWeight:'bold', color:'#555'}}>Cargo Responsable</label>
                          <p>{item.cargo_asignado || 'No asignado'}</p>
                      </div>
                  </div>

                  {/* FOOTER */}
                  <div className="form-actions full-width" style={{marginTop:'30px'}}>
                      <button 
                        type="button" 
                        className="save-button" 
                        onClick={onClose}
                        style={{background: '#64748b'}} // Gris para cerrar
                      >
                          Cerrar
                      </button>
                  </div>

              </div>
          </div>
      </div>
  );
}

export default InventarioDetalle;