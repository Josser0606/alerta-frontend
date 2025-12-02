import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';

function AlertasCumpleanos() {
    
    const [cumpleaneros, setCumpleaneros] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchCumpleaneros = async () => {
            try {
                const respuesta = await fetch(`${API_BASE_URL}/voluntarios/hoy`);
                
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los datos de la API');
                }
                const data = await respuesta.json();
                setCumpleaneros(data);
            } catch (error) {
                console.error("Error en el fetch de 'Hoy':", error);
            } finally {
                setCargando(false);
            }
        };
        fetchCumpleaneros();
    }, []); 

    if (cargando) {
        return <div className="alerta-card cargando">Cargando cumpleaños del día...</div>;
    }

    // Detectamos si está vacío
    const estaVacio = cumpleaneros.length === 0;

    return (
        <div className={`alerta-card hoy ${estaVacio ? 'empty' : ''}`}>
            <h2>¡Feliz Cumpleaños!</h2>
            
            {estaVacio ? (
                <p>No hay cumpleaños registrados para hoy.</p>
            ) : (
                <>
                    <p>Hoy celebramos a:</p>
                    <ul>
                        {cumpleaneros.map((persona) => (
                            <li key={persona.id || persona.nombre_completo}>
                                <span className="nombre">{persona.nombre_completo}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
export default AlertasCumpleanos;