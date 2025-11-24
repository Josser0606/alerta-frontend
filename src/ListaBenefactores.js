// frontend/src/components/ListaBenefactores.js
import React, { useEffect, useState } from 'react';
import API_BASE_URL from './apiConfig'; // Asegúrate de tener esto o usa la URL directa

const ListaBenefactores = ({ onClose }) => { // <--- Recibe la función onClose
  const [benefactores, setBenefactores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchBenefactores();
  }, []);

  const fetchBenefactores = async () => {
    try {
        // Ajusta la URL si no usas apiConfig
        const response = await fetch(`${API_BASE_URL}/benefactores/todos`); 
        const data = await response.json();
        setBenefactores(data);
        setLoading(false);
    } catch (error) {
        console.error("Error cargando lista:", error);
        setLoading(false);
    }
  };

  const benefactoresFiltrados = benefactores.filter(b => 
    b.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) || // Nota: El backend manda 'nombre_completo' gracias al alias
    b.numero_documento?.includes(busqueda)
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container-large">
        
        {/* Cabecera con botón de cerrar */}
        <div className="modal-header">
          <h2>📋 Infomación Completa</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        {/* Cuerpo con Buscador y Tabla */}
        <div className="modal-body">
          <input 
            type="text" 
            placeholder="🔍 Buscar por nombre o documento..." 
            className="barra-busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />

          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Cargando datos...</div>
          ) : (
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
                  {benefactoresFiltrados.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td><strong>{b.nombre_completo}</strong></td>
                      <td>{b.numero_documento || '-'}</td>
                      <td>{b.cod_1_tipo}</td>
                      <td>{b.nombre_contactado || '-'}</td>
                      <td>{b.numero_contacto || '-'}</td>
                      <td>
                        <span className={`badge ${b.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                          {b.estado || 'Desconocido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaBenefactores;