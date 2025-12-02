import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/Transporte.css'; // Importamos sus estilos específicos de lista

// --- Funciones auxiliares ---
const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'N/A'; 
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { 
        year: '2-digit', 
        month: '2-digit', 
        day: '2-digit', 
        timeZone: 'UTC' 
    });
}

const obtenerClaseEstado = (fechaISO) => {
    if (!fechaISO) return 'estado-na';
    
    const fecha = new Date(fechaISO);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaComparar = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());

    if (fechaComparar < hoy) {
        return 'estado-vencido';
    }
    return 'estado-proximo';
}

function TransporteAlertas() {
    const [vencimientos, setVencimientos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchVencimientos = async () => {
            try {
                const respuesta = await fetch(`${API_BASE_URL}/transporte/vencimientos`);
                
                if (!respuesta.ok) {
                    throw new Error('Error al obtener datos de transporte');
                }
                const data = await respuesta.json();
                setVencimientos(data);
            } catch (error) {
                console.error("Error en el fetch de 'Transporte':", error);
            } finally {
                setCargando(false);
            }
        };
        fetchVencimientos();
    }, []);

    if (cargando) {
        return <div className="alerta-card cargando">Cargando vencimientos...</div>;
    }

    // Detectamos si está vacío
    const estaVacio = vencimientos.length === 0;

    return (
        <div className={`alerta-card transporte ${estaVacio ? 'empty' : ''}`}>
            <h3>Vencimientos Próximos (Transporte)</h3>
            
            {estaVacio ? (
                <p>No hay vencimientos de SOAT, Tecnomecánica o Licencia en los próximos 30 días.</p>
            ) : (
                <ul className="vencimiento-lista">
                    {vencimientos.map((vehiculo) => (
                        <li key={vehiculo.placa} className="vencimiento-item">
                            
                            <div className="vencimiento-header">
                                <span className="nombre">{vehiculo.placa}</span>
                                <span className="descripcion-vehiculo">{vehiculo.descripcion}</span>
                            </div>
                            
                            <div className="vencimiento-detalles">
                                <div className="detalle-fecha">
                                    <strong>SOAT:</strong>
                                    <span className={`fecha ${obtenerClaseEstado(vehiculo.fecha_vencimiento_soat)}`}>
                                        {formatearFecha(vehiculo.fecha_vencimiento_soat)}
                                    </span>
                                </div>
                                <div className="detalle-fecha">
                                    <strong>Tecno:</strong>
                                    <span className={`fecha ${obtenerClaseEstado(vehiculo.fecha_vencimiento_tecnomecanica)}`}>
                                        {formatearFecha(vehiculo.fecha_vencimiento_tecnomecanica)}
                                    </span>
                                </div>
                                <div className="detalle-fecha">
                                    <strong>Licencia:</strong>
                                    <span className={`fecha ${obtenerClaseEstado(vehiculo.fecha_vencimiento_licencia)}`}>
                                        {formatearFecha(vehiculo.fecha_vencimiento_licencia)}
                                    </span>
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default TransporteAlertas;