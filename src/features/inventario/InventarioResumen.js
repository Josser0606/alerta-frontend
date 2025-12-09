import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf } from "react-icons/fa";

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
    const [generandoPDF, setGenerandoPDF] = useState(false);

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

    // --- FUNCIÓN PARA EXPORTAR PDF ---
    const handleExportarPDF = async () => {
        setGenerandoPDF(true);
        try {
            const response = await fetch(`${API_BASE_URL}/inventario/todos`);
            if (!response.ok) throw new Error("Error al obtener datos completos");
            const items = await response.json();

            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Reporte General de Inventario - Fundación Saciar", 14, 22);
            doc.setFontSize(11);
            doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableColumn = ["Código", "Categoría", "Producto", "Descripción", "Centro", "Ubicación", "Estado"];
            const tableRows = [];

            items.forEach(item => {
                // --- CORRECCIÓN DE ESTADO PARA EL PDF ---
                // Si viene 'Activo' o null, lo cambiamos a 'Sin Prioridad'
                let estadoParaMostrar = item.estado;
                if (estadoParaMostrar === 'Activo' || !estadoParaMostrar) {
                    estadoParaMostrar = 'Sin Prioridad';
                }

                const itemData = [
                    item.codigo_serie,
                    item.categoria || '-',
                    item.tipo_producto,
                    item.descripcion || '',
                    item.centro_operacion,
                    item.area_principal, 
                    estadoParaMostrar // Usamos el valor corregido
                ];
                tableRows.push(itemData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                styles: { fontSize: 7, cellPadding: 2 },
                headStyles: { fillColor: [78, 165, 38] },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 15 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 'auto' },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 25 }
                }
            });

            doc.save(`Inventario_Completo_${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error("Error al generar PDF:", error);
            alert("Hubo un error al generar el reporte PDF.");
        } finally {
            setGenerandoPDF(false);
        }
    };

    if (cargando) return <div className="alerta-card cargando">Cargando inventario...</div>;

    const estaVacio = categorias.length === 0;

    return (
        <div className={`alerta-card inventario ${estaVacio ? 'empty' : ''}`}>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                <h3 style={{margin:0, border: 'none', padding:0}}>Resumen de Inventario</h3>
                
                {!estaVacio && (
                    <button 
                        onClick={handleExportarPDF} 
                        disabled={generandoPDF}
                        style={{
                            background: '#ef4444', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            fontSize: '0.85em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                        title="Descargar reporte completo en PDF"
                    >
                        <FaFilePdf /> 
                        {generandoPDF ? 'Generando...' : 'PDF'}
                    </button>
                )}
            </div>
            
            {estaVacio ? (
                <p>No hay items registrados en el sistema.</p>
            ) : (
                <ul>
                    {categorias.map((cat) => (
                        <li key={cat.categoria} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <span className="nombre">
                                {NOMBRES_CATEGORIAS[cat.categoria] || cat.categoria} 
                                <small style={{color:'#999', marginLeft:'5px'}}>({cat.categoria})</small>
                            </span>
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