// frontend/src/TransporteAlertas.js
import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import '../../assets/styles/Transporte.css';

// --- Funciones auxiliares para este componente ---

// Formatea la fecha (ej: 12/11/25)
const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'N/A'; // Si la fecha es nula
    const fecha = new Date(fechaISO);
    // Usamos '2-digit' para un formato corto DD/MM/YY
    return fecha.toLocaleDateString('es-ES', { 
        year: '2-digit', 
        month: '2-digit', 
        day: '2-digit', 
        timeZone: 'UTC' 
    });
}

// Devuelve una clase CSS ('vencido', 'proximo' o 'na') según la fecha
const obtenerClaseEstado = (fechaISO) => {
    if (!fechaISO) return 'estado-na'; // N/A (Gris)
    
    const fecha = new Date(fechaISO);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Reseteamos la hora para comparar solo días

    // (Ajustamos la zona horaria de la fecha ISO)
    const fechaComparar = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());

    if (fechaComparar < hoy) {
        return 'estado-vencido'; // Vencido (Rojo)
    }
    
    // Si no está vencido, la API ya filtró que está próximo
    return 'estado-proximo'; // Próximo a vencer (Amarillo)
}
// --- Fin de funciones auxiliares ---


function TransporteAlertas() {
    const [vencimientos, setVencimientos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchVencimientos = async () => {
            try {
                // 1. LLAMAMOS A LA NUEVA RUTA DE TRANSPORTE
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

    // Usaremos un color azul/gris para esta tarjeta
    return (
        <div className="alerta-card transporte">
            <h3>Vencimientos Próximos (Transporte)</h3>
            
            {vencimientos.length === 0 ? (
                <p>No hay vencimientos de SOAT, Tecnomecánica o Licencia en los próximos 30 días.</p>
            ) : (
                // Esta es una lista diferente, más detallada
                <ul className="vencimiento-lista">
                    {vencimientos.map((vehiculo) => (
                        <li key={vehiculo.placa} className="vencimiento-item">
                            
                            {/* Encabezado (Placa y Descripción) */}
                            <div className="vencimiento-header">
                                <span className="nombre">{vehiculo.placa}</span>
                                <span className="descripcion-vehiculo">{vehiculo.descripcion}</span>
                            </div>
                            
                            {/* Detalles de fechas */}
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