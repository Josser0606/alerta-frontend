// frontend/src/ListaBenefactores.js
import React, { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from './apiConfig';
import './App.css'; // Asegúrate de que los estilos estén importados

const ListaBenefactores = ({ onClose }) => {
  const [benefactores, setBenefactores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Paginación y Búsqueda
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  // Función para cargar datos
  const fetchBenefactores = useCallback(async () => {
    setLoading(true);
    try {
        // Enviamos página y búsqueda al backend
        const response = await fetch(
            `${API_BASE_URL}/benefactores/todos?page=${pagina}&limit=20&search=${encodeURIComponent(busqueda)}`
        ); 
        const resultado = await response.json();
        
        // El backend ahora nos devuelve { data: [...], pagination: {...} }
        setBenefactores(resultado.data);
        setTotalPaginas(resultado.pagination.totalPages);
    } catch (error) {
        console.error("Error cargando lista:", error);
    } finally {
        setLoading(false);
    }
  }, [pagina, busqueda]); // Se recrea si cambia la página o la búsqueda

  // Efecto: Cargar cuando cambia la página
  useEffect(() => {
    fetchBenefactores();
  }, [fetchBenefactores]);

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e) => {
      setBusqueda(e.target.value);
      setPagina(1); // Al buscar, siempre volvemos a la primera página
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        
        <div className="modal-header">
          <h2>📋 Información Completa</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {/* Barra de Búsqueda */}
          <input 
            type="text" 
            placeholder="🔍 Buscar por nombre o documento..." 
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
                            <td>{b.numero_contacto ? JSON.parse(b.numero_contacto)[0]?.numero : '-'}</td>
                            <td>
                            <span className={`badge ${b.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                                {b.estado || 'Desconocido'}
                            </span>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
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