// frontend/src/ProximosCumpleanos.js

import React, { useState, useEffect } from 'react';

function ProximosCumpleanos() {
    
    // Estado para guardar los *próximos* cumpleañeros
    const [proximos, setProximos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchProximos = async () => {
            try {
                // ¡Llamamos a la NUEVA URL!
                const respuesta = await fetch('httpssa://alerta-backend-57zs.onrender.com/api/cumpleaneros/proximos');
                
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los datos de la API');
                }
                const data = await respuesta.json();
                setProximos(data);

            } catch (error) {
                console.error("Error en el fetch:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchProximos();
    }, []); 

    // ---- Renderizado ----
    
    if (cargando) {
        return <div className="alerta-card cargando">Cargando próximos cumpleaños...</div>;
    }

    // Si no hay próximos cumpleaños
    if (proximos.length === 0) {
        return (
            <div className="alerta-card empty">
                <p>No hay cumpleaños en la próxima semana.</p>
            </div>
        );
    }

    // Función simple para formatear la fecha (MM-DD)
    const formatearFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        // Ajustamos el 'timeZone' para evitar errores de un día
        return fecha.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', timeZone: 'UTC' });
    }

    // Si SÍ hay próximos cumpleaños
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