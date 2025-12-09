import React, { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/Listas.css'; 
import { FaRegEdit, FaTrashAlt, FaBoxOpen, FaEye } from "react-icons/fa"; 
import InventarioDetalle from './InventarioDetalle'; // Importamos el modal de detalle

const ListaInventario = ({ onClose, onEditar }) => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  // Estado para el modal de detalle
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  // --- CARGAR DATOS ---
  const fetchInventario = useCallback(async () => {
    setLoading(true);
    try {
        const response = await fetch(
            `${API_BASE_URL}/inventario/todos?page=${pagina}&limit=20&search=${encodeURIComponent(busqueda)}`
        ); 
        
        if (!response.ok) throw new Error('Error al obtener datos');
        
        const resultado = await response.json();
        
        let datosParaMostrar = [];

        // Manejo flexible de la respuesta
        if (Array.isArray(resultado)) {
             datosParaMostrar = resultado;
             setTotalPaginas(1);
        } else {
             datosParaMostrar = resultado.data || [];
             setTotalPaginas(resultado.pagination?.totalPages || 1);
        }

        // --- CORRECCIÓN DE ORDENAMIENTO VISUAL ---
        // Ordenamos explícitamente por código de serie para garantizar la secuencia (ECOM001, ECOM002...)
        const datosOrdenados = datosParaMostrar.sort((a, b) => {
            // Manejamos casos donde codigo_serie pudiera ser null
            const codA = a.codigo_serie || '';
            const codB = b.codigo_serie || '';
            return codA.localeCompare(codB, undefined, { numeric: true, sensitivity: 'base' });
        });

        setInventario(datosOrdenados);

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

  // Helper de estilos para el Badge
  const getBadgeStyle = (estado) => {
      if (estado === 'Con Prioridad') {
          return { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }; // Rojo
      } 
      // Cubre 'Sin Prioridad', 'Activo' y por defecto
      return { backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }; // Verde
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
          
          {/* Barra de búsqueda */}
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
                <table className="tabla-benefactores">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Producto / Descripción</th>
                      <th>Centro</th>
                      <th>Ubicación / Cargo</th>
                      <th>Estado</th>
                      <th style={{textAlign: 'center'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.length > 0 ? (
                        inventario.map((item) => (
                        <tr key={item.id}>
                            {/* CÓDIGO */}
                            <td><strong>{item.codigo_serie}</strong></td>
                            
                            {/* PRODUCTO */}
                            <td>
                                <span style={{fontWeight:'600'}}>{item.tipo_producto}</span>
                                <br/>
                                <small style={{color: '#666', fontSize: '0.85em'}}>
                                    {item.descripcion ? (item.descripcion.length > 40 ? item.descripcion.substring(0, 40) + '...' : item.descripcion) : ''}
                                </small>
                            </td>
                            
                            {/* CENTRO */}
                            <td>{item.centro_operacion}</td>
                            
                            {/* UBICACIÓN */}
                            <td>
                                {item.area_principal}
                                {item.cargo_asignado && (
                                    <small style={{display:'block', color:'#4ea526', fontWeight:'500'}}>
                                        👤 {item.cargo_asignado}
                                    </small>
                                )}
                            </td>
                            
                            {/* ESTADO */}
                            <td>
                                <span className="badge" style={getBadgeStyle(item.estado)}>
                                    {/* Muestra 'Sin Prioridad' si viene como 'Activo' */}
                                    {item.estado === 'Activo' ? 'Sin Prioridad' : (item.estado || 'Sin Prioridad')}
                                </span>
                            </td>
                            
                            {/* ACCIONES */}
                            <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {/* Botón Ver Detalle */}
                                <button 
                                    className="btn-volver"
                                    style={{ background: '#3b82f6', padding: '8px 12px', fontSize: '0.9em' }}
                                    onClick={() => setItemSeleccionado(item)}
                                    title="Ver Información Completa"
                                >
                                    <FaEye />
                                </button>

                                {/* Botón Editar */}
                                <button 
                                    className="btn-volver"
                                    style={{ background: '#46a022', padding: '8px 12px', fontSize: '0.9em' }}
                                    onClick={() => onEditar(item)}
                                    title="Editar"
                                >
                                    <FaRegEdit />
                                </button>

                                {/* Botón Eliminar */}
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
                        <tr><td colSpan="7" style={{textAlign: 'center', padding: '30px', color: '#666'}}>No se encontraron items.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                  <button className="btn-volver" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
                  <span style={{ fontWeight: 'bold', alignSelf: 'center' }}>Página {pagina} de {totalPaginas || 1}</span>
                  <button className="btn-volver" disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL DE DETALLE */}
      {itemSeleccionado && (
          <InventarioDetalle 
              item={itemSeleccionado} 
              onClose={() => setItemSeleccionado(null)} 
          />
      )}

    </div>
  );
};

export default ListaInventario;