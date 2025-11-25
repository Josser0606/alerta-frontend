import React, { useState, useEffect } from 'react';
import API_BASE_URL from './apiConfig';
import './App.css';

function BenefactorForm({ onClose, benefactorToEdit, onSuccess }) {
  
  const initialState = {
    cod_1_tipo: '', naturaleza: '', tipo_documento: '', numero_documento: '', nombre_completo: '',
    tipo_donacion: '', procedencia: '', procedencia_2: '', detalles_donacion: '', fecha_donacion: '', observaciones: '',
    nombre_contactado: '', telefonos: [{ tipo: 'Celular', numero: '' }], correos: [{ email: '' }],
    fecha_fundacion_o_cumpleanos: '', direccion: '', departamento: '', ciudad: '',
    empresa: '', cargo: '', estado_civil: '', conyuge: '', protocolo: '', contacto_saciar: '',
    estado: '', autorizacion_datos: '', fecha_rut_actualizado: '',
    certificado_donacion: 'No', certificado_donacion_detalle: '',
    fecha_actualizacion_clinton: '', antecedentes_judiciales: 'No', encuesta_satisfaccion: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // --- EFECTO MODIFICADO: CARGAR DATOS COMPLETOS DESDE EL SERVIDOR ---
  useEffect(() => {
    const cargarDatosCompletos = async () => {
      if (benefactorToEdit) {
        setCargando(true); // Mostramos "Guardando/Cargando..." mientras trae datos
        try {
            // 1. Pedimos los datos completos al nuevo endpoint
            const response = await fetch(`${API_BASE_URL}/benefactores/detalle/${benefactorToEdit.id}`);
            
            if (!response.ok) throw new Error("Error al cargar detalles completos");
            
            const b = await response.json(); // 'b' ahora tiene datos de benefactores Y donaciones

            // 2. Procesamos los datos igual que antes
            const formatDate = (dateStr) => dateStr ? dateStr.split('T')[0] : '';
            
            let tels = [{ tipo: 'Celular', numero: '' }];
            let mails = [{ email: '' }];
            
            try {
                if (b.numero_contacto) {
                   const parsedTels = JSON.parse(b.numero_contacto);
                   if (Array.isArray(parsedTels)) tels = parsedTels;
                }
                if (b.correo) {
                   const parsedMails = JSON.parse(b.correo);
                   if (Array.isArray(parsedMails)) mails = parsedMails;
                }
            } catch(e) { console.error("Error parseo contacto", e); }

            // 3. Llenamos el formulario
            setFormData({
              ...initialState,
              ...b, // Esto ahora incluye campos como 'tipo_donacion', 'observaciones', etc.
              nombre_completo: b.nombre_benefactor || b.nombre_completo || '', 
              telefonos: tels,
              correos: mails,
              fecha_fundacion_o_cumpleanos: formatDate(b.fecha_fundacion_o_cumpleanos),
              fecha_donacion: formatDate(b.fecha_donacion), // ¡Ahora sí llegará!
              fecha_rut_actualizado: b.fecha_rut_actualizado || '', 
              fecha_actualizacion_clinton: formatDate(b.fecha_actualizacion_clinton),
              procedencia_2: b.procedencia_2 || '',
              certificado_donacion_detalle: b.certificado_donacion_detalle || '',
              conyuge: b.conyuge || '',
              encuesta_satisfaccion: b.encuesta_satisfaccion || ''
            });

        } catch (error) {
            console.error(error);
            setMensaje("Error cargando la información completa del benefactor.");
        } finally {
            setCargando(false);
        }
      }
    };

    cargarDatosCompletos();
  }, [benefactorToEdit]);

  // ... (El resto de funciones handleTelefonoChange, handleCorreoChange, handleChange siguen IGUAL) ...
  const handleTelefonoChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...formData.telefonos];
    list[index][name] = value;
    setFormData({ ...formData, telefonos: list });
  };
  const handleAddTelefono = () => { if (formData.telefonos.length < 3) setFormData({ ...formData, telefonos: [...formData.telefonos, { tipo: 'Celular', numero: '' }] }); };
  const handleRemoveTelefono = (index) => { const list = [...formData.telefonos]; list.splice(index, 1); setFormData({ ...formData, telefonos: list }); };

  const handleCorreoChange = (index, event) => {
    const { value } = event.target;
    const list = [...formData.correos];
    list[index] = { email: value }; 
    setFormData({ ...formData, correos: list });
  };
  const handleAddCorreo = () => { if (formData.correos.length < 3) setFormData({ ...formData, correos: [...formData.correos, { email: '' }] }); };
  const handleRemoveCorreo = (index) => { const list = [...formData.correos]; list.splice(index, 1); setFormData({ ...formData, correos: list }); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- ENVIAR FORMULARIO (Sigue Igual) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    const dataToSend = {
      ...formData,
      telefonos: formData.telefonos.filter(t => t.numero && t.numero.toString().trim() !== ''),
      correos: formData.correos.map(c => c.email).filter(email => email && email.trim() !== ''),
    };

    if (dataToSend.telefonos.length === 0) { setMensaje('Debe agregar al menos un teléfono.'); setCargando(false); return; }
    if (dataToSend.correos.length === 0) { setMensaje('Debe agregar al menos un correo.'); setCargando(false); return; }

    try {
      const url = benefactorToEdit 
        ? `${API_BASE_URL}/benefactores/editar/${benefactorToEdit.id}`
        : `${API_BASE_URL}/benefactores/nuevo`;
      
      const method = benefactorToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || 'Error al guardar');

      alert(benefactorToEdit ? 'Datos actualizados con éxito' : 'Benefactor guardado con éxito');
      
      if (onSuccess) { onSuccess(); } else { window.location.reload(); }
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
                  <h2>{benefactorToEdit ? 'Editar Benefactor' : 'Agregar Nuevo Benefactor'}</h2>
                  <button className="close-button" onClick={onClose}>×</button>
              </div>
              
              {/* Solo cambiamos un poco aquí para bloquear si está cargando datos iniciales */}
              <form onSubmit={handleSubmit} className="benefactor-form-grid" style={{ opacity: cargando && benefactorToEdit ? 0.5 : 1 }}>
                  
                  {/* ... (TODO EL RESTO DE TU JSX SE MANTIENE EXACTAMENTE IGUAL) ... */}
                  {/* Copia aquí todo el contenido de los inputs que ya tenías */}
                  
                  <div className="form-group">
                      <label>1. Tipo de Registro *</label>
                      <select name="cod_1_tipo" value={formData.cod_1_tipo} onChange={handleChange} required>
                          <option value="">Seleccione...</option>
                          <option value="Benefactor">1.Benefactor</option>
                          <option value="Contacto Alterno">2.Contacto Alterno</option>
                          <option value="Compras - Proveedor">3.Compras - Proveedor</option>
                          <option value="Protocolo">4 .Protocolo</option>
                          <option value="Voluntario">5.Voluntario</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>2. Naturaleza *</label>
                      <select name="naturaleza" value={formData.naturaleza} onChange={handleChange} required>
                          <option value="">Seleccione...</option>
                          <option value="Juridica">Jurídica</option>
                          <option value="Natural">Natural</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>3. Tipo Documento *</label>
                      <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} required>
                          <option value="">Seleccione...</option>
                          <option value="CC">Cédula (CC)</option>
                          <option value="NIT">NIT</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>4. Número Documento *</label>
                      <input type="number" name="numero_documento" value={formData.numero_documento} onChange={handleChange} required />
                  </div>

                  <div className="form-group full-width">
                      <label>5. Nombre del Benefactor *</label>
                      <input type="text" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                      <label>6. Tipo de Donación *</label>
                      <select name="tipo_donacion" value={formData.tipo_donacion} onChange={handleChange} required>
                          <option value="">Seleccione...</option>
                          <option value="Dinero">Dinero</option>
                          <option value="Especie">Especie</option>
                          <option value="Servicio">Servicio</option>
                          <option value="Voluntario">Voluntario</option>
                          <option value="Protocolo">Protocolo</option>
                          <option value="Proveedor">Proveedor</option>
                          <option value="Medios de Comunicación">Medios de Comunicación</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>7. Procedencia *</label>
                      <select name="procedencia" value={formData.procedencia} onChange={handleChange} required>
                          <option value="">Seleccione...</option>
                          <option value="Abaco">Abaco</option>
                          <option value="Administración">Administración</option>
                          <option value="Apoyo Catatumbo">Apoyo Catatumbo</option>
                          <option value="Bono">Bono</option>
                          <option value="Bono día de la madre">Bono día de la madre</option>
                          <option value="Centrales de abasto">Centrales de abasto</option>
                          <option value="Debito automático">Debito automático</option>
                          <option value="Eatcloud">Eatcloud</option>
                          <option value="Excedentes de amor">Excedentes de amor</option>
                          <option value="Hambre cero">Hambre cero</option>
                          <option value="Kits escolares">Kits escolares</option>
                          <option value="Operaciones">Operaciones</option>
                          <option value="Plan padrino">Plan padrino</option>
                          <option value="Reagro">Reagro</option>
                          <option value="Saciar">Saciar</option>
                          <option value="Servicio">Servicio</option>
                          <option value="Tareas navidad">Tareas navidad</option>
                          <option value="Templos comedores">Templos comedores</option>
                      </select>
                  </div>
                  <div className="form-group">
                      <label>7.1. Procedencia (Otra)</label>
                      <input type="text" name="procedencia_2" value={formData.procedencia_2} onChange={handleChange} placeholder="Opcional"/>
                  </div>

                  <div className="form-group full-width">
                      <label>8. Detalles de la donación *</label>
                      <textarea name="detalles_donacion" value={formData.detalles_donacion} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                      <label>9. Fecha Donación *</label>
                      <input type="date" name="fecha_donacion" value={formData.fecha_donacion} onChange={handleChange} required />
                  </div>

                  <div className="form-group full-width">
                      <label>10. Observaciones *</label>
                      <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} required />
                  </div>
                  
                  <hr className="full-width-hr" />

                  <div className="form-group">
                      <label>11. Nombre del Contactado *</label>
                      <input type="text" name="nombre_contactado" value={formData.nombre_contactado} onChange={handleChange} required />
                  </div>
                  
                  <div className="form-group"></div>

                  <div className="form-group full-width">
                      <label>12. Teléfonos *</label>
                      {formData.telefonos.map((tel, index) => (
                      <div key={index} className="dynamic-input-group">
                          <select name="tipo" value={tel.tipo} onChange={(e) => handleTelefonoChange(index, e)}>
                          <option value="Celular">Celular</option>
                          <option value="Teléfono">Teléfono</option>
                          </select>
                          <input
                          type="number"
                          name="numero"
                          placeholder="Número"
                          value={tel.numero}
                          onChange={(e) => handleTelefonoChange(index, e)}
                          required={index === 0} 
                          />
                          {formData.telefonos.length > 1 && (
                          <button type="button" className="remove-btn" onClick={() => handleRemoveTelefono(index)}>–</button>
                          )}
                      </div>
                      ))}
                      {formData.telefonos.length < 3 && (
                      <button type="button" className="add-btn" onClick={handleAddTelefono}>+ Agregar Teléfono</button>
                      )}
                  </div>

                  <div className="form-group full-width">
                      <label>13. Correo Electrónico *</label>
                      {formData.correos.map((correo, index) => (
                      <div key={index} className="dynamic-input-group">
                          <input
                          type="email"
                          name="email"
                          placeholder="ejemplo@correo.com"
                          value={correo.email}
                          onChange={(e) => handleCorreoChange(index, e)}
                          required={index === 0} 
                          />
                          {formData.correos.length > 1 && (
                          <button type="button" className="remove-btn" onClick={() => handleRemoveCorreo(index)}>–</button>
                          )}
                      </div>
                      ))}
                      {formData.correos.length < 3 && (
                      <button type="button" className="add-btn" onClick={handleAddCorreo}>+ Agregar Correo</button>
                      )}
                  </div>

                  <div className="form-group">
                      <label>14. Fecha Fundación/Cumpleaños *</label>
                      <input type="date" name="fecha_fundacion_o_cumpleanos" value={formData.fecha_fundacion_o_cumpleanos} onChange={handleChange} required />
                  </div>
                  
                  <div className="form-group">
                      <label>15. Dirección *</label>
                      <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Ciudad *</label>
                      <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Departamento *</label>
                      <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} required />
                  </div>
                  
                  <hr className="full-width-hr" />

                  <div className="form-group">
                      <label>16. Empresa *</label>
                      <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                      <label>17. Cargo *</label>
                      <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                      <label>18. Estado Civil</label>
                      <select name="estado_civil" value={formData.estado_civil} onChange={handleChange}>
                      <option value="">Seleccione...</option>
                      <option value="Casado/a">Casado/a</option>
                      <option value="Soltero/a">Soltero/a</option>
                      <option value="Viudo/a">Viudo/a</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>19. Cónyuge</label>
                      <input type="text" name="conyuge" value={formData.conyuge} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                      <label>20. Protocolo *</label>
                      <select name="protocolo" value={formData.protocolo} onChange={handleChange} required>
                      <option value="">Seleccione...</option>
                      <option value="Señor">Señor</option>
                      <option value="Señora">Señora</option>
                      <option value="Señores">Señores</option>
                      <option value="Señoras">Señoras</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>21. Contacto Saciar *</label>
                      <input type="text" name="contacto_saciar" value={formData.contacto_saciar} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                      <label>22. Estado *</label>
                      <input type="text" name="estado" value={formData.estado} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                      <label>23. Autorización Datos (Fecha o 'No') *</label>
                      <input type="text" name="autorizacion_datos" value={formData.autorizacion_datos} onChange={handleChange} required placeholder="YYYY-MM-DD o No" />
                  </div>

                  <div className="form-group">
                      <label>24. RUT Actualizado (Fecha o 'No') *</label>
                      <input type="text" name="fecha_rut_actualizado" value={formData.fecha_rut_actualizado} onChange={handleChange} required placeholder="YYYY-MM-DD o No" />
                  </div>

                  <div className="form-group">
                      <label>25. Certificado Donación *</label>
                      <select name="certificado_donacion" value={formData.certificado_donacion} onChange={handleChange} required>
                      <option value="No">No</option>
                      <option value="Si">Si</option>
                      </select>
                  </div>
                  {formData.certificado_donacion === 'Si' && (
                      <div className="form-group full-width">
                      <label>Detalle Certificado</label>
                      <input type="text" name="certificado_donacion_detalle" value={formData.certificado_donacion_detalle} onChange={handleChange} />
                      </div>
                  )}

                  <div className="form-group">
                      <label>26. Fecha Act. Lista Clinton *</label>
                      <input type="date" name="fecha_actualizacion_clinton" value={formData.fecha_actualizacion_clinton} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                      <label>27. Antecedentes Judiciales *</label>
                      <select name="antecedentes_judiciales" value={formData.antecedentes_judiciales} onChange={handleChange} required>
                          <option value="No">No</option>
                          <option value="Si">Si</option>
                      </select>
                  </div>

                  <div className="form-group full-width">
                      <label>28. Encuesta de Satisfacción</label>
                      <textarea name="encuesta_satisfaccion" value={formData.encuesta_satisfaccion} onChange={handleChange} />
                  </div>

                  <div className="form-actions full-width">
                      {mensaje && <p className="error-mensaje">{mensaje}</p>}
                      <button type="submit" className="save-button" disabled={cargando}>
                          {cargando ? 'Guardando...' : (benefactorToEdit ? 'Actualizar Benefactor' : 'Guardar Benefactor')}
                      </button>
                  </div>
                  
              </form>
          </div>
      </div>
  );
}

export default BenefactorForm;