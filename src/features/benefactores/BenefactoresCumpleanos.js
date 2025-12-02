import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
// No es necesario importar CSS específico si ya se carga en DashboardPage, 
// pero lo dejamos por si tienes estilos globales extra.

function BenefactoresCumpleanos() {
    const [cumpleaneros, setCumpleaneros] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchCumpleaneros = async () => {
            try {
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

    // Detectamos si está vacío para aplicar el estilo "apagado"
    const estaVacio = cumpleaneros.length === 0;

    return (
        <div className={`alerta-card benefactores ${estaVacio ? 'empty' : ''}`}>
            <h2>¡Cumpleaños de Benefactores!</h2>
            
            {estaVacio ? (
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