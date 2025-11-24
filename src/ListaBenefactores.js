// frontend/src/ListaBenefactores.js
import React, { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from './apiConfig';
import './App.css'; 

const ListaBenefactores = ({ onClose }) => {
  const [benefactores, setBenefactores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Paginación y Búsqueda
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  // --- FUNCIÓN PARA MANEJAR TELÉFONOS (CORRECCIÓN ERROR JSON) ---
  const obtenerTelefono = (datoRaw) => {
    if (!datoRaw) return '-'; // Si es null o vacío retorna guion

    try {
      // 1. Intentamos convertirlo de JSON string a Objeto
      const parsed = JSON.parse(datoRaw);
      
      // 2. Si es un array (formato nuevo), devolvemos el primero
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0].numero; 
      }
      
      // 3. Si es un objeto pero no array (caso raro), lo devolvemos string
      return JSON.stringify(parsed);

    } catch (error) {
      // 4. SI FALLA EL PARSEO (porque es texto plano '300-123...'), 
      // devolvemos el dato tal cual viene de la base de datos.
      return datoRaw;
    }
  };

  // --- FUNCIÓN PARA CARGAR DATOS (PAGINADOS) ---
  const fetchBenefactores = useCallback(async () => {
    setLoading(true);
    try {
        // Enviamos página, límite y búsqueda al backend
        const response = await fetch(
            `${API_BASE_URL}/benefactores/todos?page=${pagina}&limit=20&search=${encodeURIComponent(busqueda)}`
        ); 
        
        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const resultado = await response.json();
        
        // El backend nos devuelve { data: [...], pagination: {...} }
        setBenefactores(resultado.data);
        setTotalPaginas(resultado.pagination.totalPages);
    } catch (error) {
        console.error("Error cargando lista:", error);
    } finally {
        setLoading(false);
    }
  }, [pagina, busqueda]); // Se recrea si cambia la página o la búsqueda

  // Efecto: Cargar cuando cambia la página (o la búsqueda a través del callback)
  useEffect(() => {
    fetchBenefactores();
  }, [fetchBenefactores]);

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e) => {
      setBusqueda(e.target.value);
      setPagina(1); // Al buscar, siempre volvemos a la primera página para ver los resultados
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        
        {/* Cabecera */}
        <div className="modal-header">
          <h2>📋 Información Completa</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        {/* Cuerpo */}
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
                            
                            {/* Usamos la función segura aquí */}
                            <td>{obtenerTelefono(b.numero_contacto)}</td>
                            
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