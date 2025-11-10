// Importamos los 'hooks' necesarios de React
import React, { useState, useEffect } from 'react';

// Definimos el componente
function AlertasCumpleanos() {
    
    // 1. "Estado" para guardar a los cumpleañeros
    // Empezará como un array vacío.
    const [cumpleaneros, setCumpleaneros] = useState([]);

    // 2. "Estado" para saber si ya terminó de cargar
    // (Útil para mostrar un mensaje de "Cargando...")
    const [cargando, setCargando] = useState(true);

    // 3. El "Efecto" que se ejecuta cuando el componente se monta
    // Aquí es donde llamamos a nuestra API (el backend)
    useEffect(() => {
        
        // Esta es la función que llama a la API
        const fetchCumpleaneros = async () => {
            try {
                // ¡IMPORTANTE! Esta es la URL de la API que creamos
                const respuesta = await fetch('http://localhost:3001/api/cumpleaneros/hoy');
                
                if (!respuesta.ok) {
                    // Si el servidor (backend) nos dio un error
                    throw new Error('Error al obtener los datos de la API');
                }

                const data = await respuesta.json();
                
                // Guardamos los datos recibidos en nuestro "estado"
                setCumpleaneros(data);

            } catch (error) {
                console.error("Error en el fetch:", error);
                // Aquí podrías guardar un estado de "error" para mostrarlo
            
            } finally {
                // Pase lo que pase (éxito o error), dejamos de cargar
                setCargando(false);
            }
        };

        // Ejecutamos la función que acabamos de definir
        fetchCumpleaneros();

    }, []); // El array vacío [] significa: "ejecuta esto SOLO UNA VEZ, cuando el componente aparezca"

    // 4. Lógica de renderizado (Qué mostrar en la pantalla)

    // Si aún está cargando...
    if (cargando) {
        return <div className="alerta-card cargando">Cargando cumpleaños del día...</div>;
    }

    // Si no está cargando y NO hay cumpleañeros (el array está vacío)
    if (cumpleaneros.length === 0) {
        return (
            <div className="alerta-card empty">
                <h3>¡Feliz día!</h3>
                <p>No hay cumpleaños registrados para hoy.</p>
            </div>
        );
    }

    // Si no está cargando y SÍ hay cumpleañeros
    return (
        <div className="alerta-card hoy">
            <h2>¡Feliz Cumpleaños!</h2>
            <p>Hoy celebramos a:</p>
            <ul>
                {cumpleaneros.map((persona) => (
                    <li key={persona.id || persona.nombre_completo}>
                        {persona.nombre_completo}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Exportamos el componente para usarlo en App.js u otro lugar
export default AlertasCumpleanos;