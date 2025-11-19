import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Crearemos este estilo en el Paso 3

const ListaBenefactores = () => {
  const [benefactores, setBenefactores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBenefactores();
  }, []);

  const fetchBenefactores = async () => {
    try {
        // Asegúrate de usar la URL correcta de tu backend (local o render)
        // Si estás en local usa http://localhost:3001/api/benefactores/todos
        // Si ya subiste cambios a Render, usa la URL de Render.
        const response = await fetch('https://alerta-backend-57zs.onrender.com/api/benefactores/todos'); 
        const data = await response.json();
        setBenefactores(data);
        setLoading(false);
    } catch (error) {
        console.error("Error cargando lista:", error);
        setLoading(false);
    }
  };

  // Filtro de búsqueda simple
  const benefactoresFiltrados = benefactores.filter(b => 
    b.nombre_benefactor?.toLowerCase().includes(busqueda.toLowerCase()) ||
    b.numero_documento?.includes(busqueda)
  );

  return (
    <div className="lista-container">
      <div className="lista-header">
        <button className="btn-volver" onClick={() => navigate('/benefactores')}>⬅ Volver</button>
        <h2>Base de Datos Completa</h2>
      </div>

      <input 
        type="text" 
        placeholder="Buscar por nombre o documento..." 
        className="barra-busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="tabla-scroll">
          <table className="tabla-benefactores">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Donación</th>
              </tr>
            </thead>
            <tbody>
              {benefactoresFiltrados.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td><strong>{b.nombre_benefactor}</strong></td>
                  <td>{b.numero_documento || '-'}</td>
                  <td>{b.cod_1_tipo}</td>
                  <td>{b.nombre_contactado || '-'}</td>
                  <td>{b.numero_contacto || '-'}</td>
                  <td>{b.correo || '-'}</td>
                  <td>
                    <span className={`etiqueta ${b.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
                      {b.estado}
                    </span>
                  </td>
                  <td>{b.tipo_donacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaBenefactores;