// frontend/src/BenefactoresCumpleanos.js
import React, { useState, useEffect } from 'react';
import API_BASE_URL from './apiConfig';
import './App.css';

function BenefactoresCumpleanos() {
    const [cumpleaneros, setCumpleaneros] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchCumpleaneros = async () => {
            try {
                // --- 1. LLAMAMOS A LA NUEVA RUTA ---
                const respuesta = await fetch(`${API_BASE_URL}/benefactores/hoy`);
                
                if (!respuesta.ok) {
                    throw new Error('Error al obtener datos de benefactores');
                }
                const data = await respuesta.json();
                setCumpleaneros(data);
            } catch (error) {
                console.error("Error en el fetch de 'Benefactores Hoy':", error);
            } finally {
                setCargando(false);
            }
        };
        fetchCumpleaneros();
    }, []); 

    if (cargando) {
        return <div className="alerta-card cargando">Cargando cumpleaños...</div>;
    }

    // Usaremos un color verde para esta tarjeta
    return (
        <div className="alerta-card benefactores">
            <h2>¡Cumpleaños de Benefactores!</h2>
            
            {cumpleaneros.length === 0 ? (
                <p>No hay benefactores que cumplan años hoy.</p>
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
export default BenefactoresCumpleanos;