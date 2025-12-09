import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';

// Diccionario para mostrar nombres bonitos en lugar de códigos
const NOMBRES_CATEGORIAS = {
    'TE': 'Terrenos',
    'COE': 'Construcciones y Edificios',
    'MAE': 'Maquinaria y Equipo',
    'EQO': 'Equipos y Oficina',
    'ECOM': 'Equipo de Cómputo',
    'FLT': 'Flota y Transporte'
};

function InventarioResumen() {
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchResumen = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/inventario/resumen`);
                if (!res.ok) throw new Error("Error fetching");
                const data = await res.json();
                setCategorias(data);
            } catch (e) {
                console.error("Error cargando resumen inventario:", e);
            } finally {
                setCargando(false);
            }
        };
        fetchResumen();
    }, []);

    if (cargando) return <div className="alerta-card cargando">Cargando inventario...</div>;

    const estaVacio = categorias.length === 0;

    return (
        <div className={`alerta-card inventario ${estaVacio ? 'empty' : ''}`}>
            <h3>Resumen de Inventario</h3>
            
            {estaVacio ? (
                <p>No hay items registrados en el sistema.</p>
            ) : (
                <ul>
                    {categorias.map((cat) => (
                        <li key={cat.categoria} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            {/* Nombre de la categoría */}
                            <span className="nombre">
                                {NOMBRES_CATEGORIAS[cat.categoria] || cat.categoria} 
                                <small style={{color:'#999', marginLeft:'5px'}}>({cat.categoria})</small>
                            </span>
                            
                            {/* Cantidad */}
                            <span className="badge-count">
                                {cat.total} items
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default InventarioResumen;