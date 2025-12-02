import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';

// Función para formatear la fecha
const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function BenefactoresPagos() {
    const [pagos, setPagos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchPagos = async () => {
            try {
                const respuesta = await fetch(`${API_BASE_URL}/benefactores/pagos`);
                
                if (!respuesta.ok) {
                    throw new Error('Error al obtener datos de pagos');
                }
                const data = await respuesta.json();
                setPagos(data);
            } catch (error) {
                console.error("Error en el fetch de 'Pagos':", error);
            } finally {
                setCargando(false);
            }
        };
        fetchPagos();
    }, []);

    if (cargando) {
        return <div className="alerta-card cargando">Cargando pagos...</div>;
    }

    // Detectamos si está vacío
    const estaVacio = pagos.length === 0;

    return (
        <div className={`alerta-card pagos ${estaVacio ? 'empty' : ''}`}>
            <h3>Alertas de Pago (Próximos 7 Días)</h3>
            
            {estaVacio ? (
                <p>No hay pagos pendientes o vencidos en los próximos 7 días.</p>
            ) : (
                <ul>
                    {pagos.map((pago) => (
                        <li key={pago.id || pago.nombre_completo}>
                            <span className="nombre">{pago.nombre_completo}</span>
                            {/* Le ponemos un estilo al estado del pago */}
                            <span className={`fecha estado-${pago.estado_pago.toLowerCase()}`}>
                                {formatearFecha(pago.fecha_proximo_pago)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default BenefactoresPagos;