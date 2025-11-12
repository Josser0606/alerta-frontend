// frontend/src/ProximosCumpleanos.js
import React, { useState, useEffect } from 'react';
import API_BASE_URL from './apiConfig';
// NO importamos apiConfig.js

function ProximosCumpleanos() {
    
    const [proximos, setProximos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchProximos = async () => {
            try {
                // --- APUNTAMOS DIRECTO A RENDER ---
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

    if (proximos.length === 0) {
        return (
            <div className="alerta-card empty">
                <p>No hay cumpleaños en la próxima semana.</p>
            </div>
        );
    }

    const formatearFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', timeZone: 'UTC' });
    }

    return (
        <div className="alerta-card proximos">
            <h3>Próximos Cumpleaños (7 días):</h3>
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
        </div>
    );
}
export default ProximosCumpleanos;