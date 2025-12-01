import React, { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/Listas.css';
import { FaRegEdit, FaTrashAlt } from "react-icons/fa"; // <--- Importamos el ícono de eliminar
import { IoSearchOutline } from "react-icons/io5";

const ListaBenefactores = ({ onClose, onEditar }) => {
  const [benefactores, setBenefactores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Paginación y Búsqueda
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  // --- FUNCIÓN SEGURA PARA MANEJAR TELÉFONOS ---
  const obtenerTelefono = (datoRaw) => {
    if (!datoRaw) return '-'; 

    try {
      const parsed = JSON.parse(datoRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0].numero; 
      }
      return JSON.stringify(parsed);
    } catch (error) {
      return datoRaw;
    }
  };

  // --- FUNCIÓN PARA CARGAR DATOS ---
  const fetchBenefactores = useCallback(async () => {
    setLoading(true);
    try {
        const response = await fetch(
            `${API_BASE_URL}/benefactores/todos?page=${pagina}&limit=20&search=${encodeURIComponent(busqueda)}`
        ); 
        
        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const resultado = await response.json();
        setBenefactores(resultado.data);
        setTotalPaginas(resultado.pagination.totalPages);
    } catch (error) {
        console.error("Error cargando lista:", error);
    } finally {
        setLoading(false);
    }
  }, [pagina, busqueda]); 

  useEffect(() => {
    fetchBenefactores();
  }, [fetchBenefactores]);

  // --- NUEVA FUNCIÓN: ELIMINAR ---
  const handleDelete = async (id, nombre) => {
      // 1. Confirmación del usuario
      const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar al benefactor "${nombre}"?\nEsta acción no se puede deshacer.`);
      
      if (!confirmar) return;

      try {
          // 2. Petición a la API
          const response = await fetch(`${API_BASE_URL}/benefactores/eliminar/${id}`, {
              method: 'DELETE',
          });

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.mensaje || "Error al eliminar");
          }

          // 3. Actualizar la lista localmente (sin recargar)
          setBenefactores(prev => prev.filter(b => b.id !== id));
          alert("Benefactor eliminado correctamente.");

      } catch (error) {
          console.error("Error:", error);
          alert("Hubo un error al intentar eliminar.");
      }
  };

  const handleSearchChange = (e) => {
      setBusqueda(e.target.value);
      setPagina(1); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        
        <div className="modal-header">
          <h2>Información Completa</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..." 
            className="barra-busqueda"
            value={busqueda}
            onChange={handleSearchChange}
            autoFocus
          />

          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Cargando datos...</div>
          ) : (
            <>
              <div className="tabla-container">
                <table className="tabla-benefactores">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Documento</th>
                      <th>Tipo</th>
                      <th>Contacto</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th style={{textAlign: 'center'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benefactores.length > 0 ? (
                        benefactores.map((b) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td><strong>{b.nombre_benefactor}</strong></td>
                            <td>{b.numero_documento || '-'}</td>
                            <td>{b.cod_1_tipo}</td>
                            <td>{b.nombre_contactado || '-'}</td>
                            
                            <td>{obtenerTelefono(b.numero_contacto)}</td>
                            
                            <td>
                                <span className={`badge ${b.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                                    {b.estado || 'Desconocido'}
                                </span>
                            </td>
                            
                            {/* Columna de Acciones */}
                            <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {/* Botón Editar */}
                                <button 
                                    className="btn-volver"
                                    style={{ background: '#46a022', padding: '8px 12px', fontSize: '0.9em' }}
                                    title="Editar"
                                    onClick={() => onEditar(b)}
                                >
                                    <FaRegEdit />
                                </button>

                                {/* Botón Eliminar - NUEVO */}
                                <button 
                                    className="btn-volver"
                                    style={{ background: '#d9534f', padding: '8px 12px', fontSize: '0.9em' }}
                                    title="Eliminar"
                                    onClick={() => handleDelete(b.id, b.nombre_benefactor)}
                                >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                                No se encontraron resultados.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* --- CONTROLES DE PAGINACIÓN --- */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px', paddingBottom: '10px' }}>
                  <button 
                    className="btn-volver" 
                    disabled={pagina === 1}
                    onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                    style={{ opacity: pagina === 1 ? 0.5 : 1 }}
                  >
                    Anterior
                  </button>
                  
                  <span style={{ fontWeight: 'bold' }}>
                    Página {pagina} de {totalPaginas || 1}
                  </span>

                  <button 
                    className="btn-volver" 
                    disabled={pagina >= totalPaginas}
                    onClick={() => setPagina(prev => prev + 1)}
                    style={{ opacity: pagina >= totalPaginas ? 0.5 : 1 }}
                  >
                    Siguiente
                  </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaBenefactores;