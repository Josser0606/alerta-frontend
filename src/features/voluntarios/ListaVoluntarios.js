import React, { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/Listas.css'; // Reutilizamos estilos
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";

const ListaVoluntarios = ({ onClose, onEditar }) => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  const fetchVoluntarios = useCallback(async () => {
    setLoading(true);
    try {
        const response = await fetch(
            `${API_BASE_URL}/voluntarios/todos?page=${pagina}&limit=20&search=${encodeURIComponent(busqueda)}`
        ); 
        if (!response.ok) throw new Error('Error al obtener datos');
        const resultado = await response.json();
        
        setVoluntarios(resultado.data);
        setTotalPaginas(resultado.pagination.totalPages);
    } catch (error) {
        console.error("Error cargando lista:", error);
    } finally {
        setLoading(false);
    }
  }, [pagina, busqueda]); 

  useEffect(() => {
    fetchVoluntarios();
  }, [fetchVoluntarios]);

  const handleDelete = async (id, nombre) => {
      if (!window.confirm(`¿Eliminar a ${nombre}?`)) return;
      try {
          const response = await fetch(`${API_BASE_URL}/voluntarios/eliminar/${id}`, { method: 'DELETE' });
          if (!response.ok) throw new Error("Error al eliminar");
          setVoluntarios(prev => prev.filter(v => v.id !== id));
          alert("Voluntario eliminado.");
      } catch (error) {
          console.error(error);
          alert("No se pudo eliminar.");
      }
  };

  const formatearFecha = (fechaISO) => {
      if (!fechaISO) return '-';
      return new Date(fechaISO).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <IoPeopleOutline /> Lista de Voluntarios
          </h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            className="barra-busqueda"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            autoFocus
          />

          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Cargando...</div>
          ) : (
            <>
              <div className="tabla-container">
                <table className="tabla-benefactores">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Cumpleaños</th>
                      <th>Estado</th>
                      <th style={{textAlign: 'center'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voluntarios.length > 0 ? (
                        voluntarios.map((v) => (
                        <tr key={v.id}>
                            <td><strong>{v.nombre_completo}</strong></td>
                            <td>{v.telefono || '-'}</td>
                            <td>{v.correo || '-'}</td>
                            <td>{formatearFecha(v.fecha_nacimiento)}</td>
                            <td>
                                <span className={`badge ${v.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                                    {v.estado || 'Activo'}
                                </span>
                            </td>
                            
                            <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button 
                                    className="btn-volver"
                                    style={{ background: '#46a022', padding: '8px 12px', fontSize: '0.9em' }}
                                    onClick={() => onEditar(v)}
                                >
                                    <FaRegEdit />
                                </button>

                                <button 
                                    className="btn-volver"
                                    style={{ background: '#d9534f', padding: '8px 12px', fontSize: '0.9em' }}
                                    onClick={() => handleDelete(v.id, v.nombre_completo)}
                                >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No hay voluntarios.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                  <button className="btn-volver" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
                  <span style={{ fontWeight: 'bold' }}>Página {pagina} de {totalPaginas || 1}</span>
                  <button className="btn-volver" disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaVoluntarios;