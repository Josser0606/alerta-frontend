import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';

function ProximosCumpleanos() {
    
    const [proximos, setProximos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchProximos = async () => {
            try {
                const respuesta = await fetch(`${API_BASE_URL}/voluntarios/proximos`);
                
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los datos de la API');
                }
                const data = await respuesta.json();
                setProximos(data);
            } catch (error) {
                console.error("Error en el fetch de 'Proximos':", error);
            } finally {
                setCargando(false);
            }
        };
        fetchProximos();
    }, []); 

    if (cargando) {
        return <div className="alerta-card cargando">Cargando próximos cumpleaños...</div>;
    }

    const estaVacio = proximos.length === 0;

    const formatearFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', timeZone: 'UTC' });
    }

    return (
        <div className={`alerta-card proximos ${estaVacio ? 'empty' : ''}`}>
            <h3>Próximos Cumpleaños (7 días):</h3>
            
            {estaVacio ? (
                 <p>No hay cumpleaños en la próxima semana.</p>
            ) : (
                <ul>
                    {proximos.map((persona) => (
                        <li key={persona.id || persona.nombre_completo}>
                            <span className="nombre">{persona.nombre_completo}</span>
                            <span className="fecha">
                                ({formatearFecha(persona.fecha_nacimiento)})
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default ProximosCumpleanos;