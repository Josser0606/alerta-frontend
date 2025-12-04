import React, { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/Listas.css'; // Reutilizamos estilos globales
import { FaRegEdit, FaTrashAlt, FaBoxOpen } from "react-icons/fa"; // Icono de caja para inventario

const ListaInventario = ({ onClose, onEditar }) => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  // --- CARGAR DATOS ---
  const fetchInventario = useCallback(async () => {
    setLoading(true);
    try {
        const response = await fetch(
            `${API_BASE_URL}/inventario/todos?page=${pagina}&limit=20&search=${encodeURIComponent(busqueda)}`
        ); 
        
        if (!response.ok) throw new Error('Error al obtener datos');
        
        // Nota: Si tu backend de inventario aún no tiene paginación implementada en la respuesta JSON, 
        // asegúrate de que devuelva { data: [...], pagination: {...} } o ajusta esto.
        // Por ahora asumimos que el backend devuelve un array directo si no hay paginación, 
        // o la estructura paginada. Ajustaremos según tu respuesta del backend.
        const resultado = await response.json();
        
        // Verificación flexible por si el backend devuelve array directo (sin paginación aún)
        if (Array.isArray(resultado)) {
             setInventario(resultado);
             setTotalPaginas(1);
        } else {
             setInventario(resultado.data || []);
             setTotalPaginas(resultado.pagination?.totalPages || 1);
        }

    } catch (error) {
        console.error("Error cargando inventario:", error);
    } finally {
        setLoading(false);
    }
  }, [pagina, busqueda]); 

  useEffect(() => {
    fetchInventario();
  }, [fetchInventario]);

  // --- ELIMINAR ITEM ---
  const handleDelete = async (id, codigo) => {
      if (!window.confirm(`¿Estás seguro de eliminar el item ${codigo}?`)) return;

      try {
          const response = await fetch(`${API_BASE_URL}/inventario/eliminar/${id}`, { method: 'DELETE' });
          
          if (!response.ok) throw new Error("Error al eliminar");
          
          setInventario(prev => prev.filter(item => item.id !== id));
          alert("Item eliminado correctamente.");
      } catch (error) {
          console.error(error);
          alert("No se pudo eliminar el item.");
      }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <FaBoxOpen /> Inventario General
          </h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <input 
            type="text" 
            placeholder="🔍 Buscar por código, producto o descripción..." 
            className="barra-busqueda"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            autoFocus
          />

          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Cargando inventario...</div>
          ) : (
            <>
              <div className="tabla-container">
                <table className="tabla-benefactores"> {/* Reutilizamos clase de tabla */}
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Centro</th>
                      <th>Área</th>
                      <th>Cargo</th>
                      <th>Estado</th>
                      <th style={{textAlign: 'center'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.length > 0 ? (
                        inventario.map((item) => (
                        <tr key={item.id}>
                            <td><strong>{item.codigo_serie}</strong></td>
                            <td>
                                {item.tipo_producto}
                                <br/>
                                <small style={{color: '#666'}}>{item.descripcion ? item.descripcion.substring(0, 30) + '...' : ''}</small>
                            </td>
                            <td>{item.centro_operacion}</td>
                            <td>
                                {item.area_principal}
                                {item.sub_area_asignada && <small style={{display:'block', color:'#888'}}>{item.sub_area_asignada}</small>}
                            </td>
                            <td>{item.cargo_asignado || '-'}</td>
                            <td>
                                <span className={`badge ${item.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                                    {item.estado || 'Activo'}
                                </span>
                            </td>
                            
                            <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button 
                                    className="btn-volver"
                                    style={{ background: '#46a022', padding: '8px 12px', fontSize: '0.9em' }}
                                    onClick={() => onEditar(item)}
                                    title="Editar"
                                >
                                    <FaRegEdit />
                                </button>

                                <button 
                                    className="btn-volver"
                                    style={{ background: '#d9534f', padding: '8px 12px', fontSize: '0.9em' }}
                                    onClick={() => handleDelete(item.id, item.codigo_serie)}
                                    title="Eliminar"
                                >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No hay items registrados.</td></tr>
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

export default ListaInventario;