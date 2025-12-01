// frontend/src/LoginPage.js
import React, { useState } from 'react';
import API_BASE_URL from '../api/apiConfig';
import '../assets/styles/Login.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        setError('');
        setCargando(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al iniciar sesión');
            }
            
            // ¡ÉXITO!
            // Guardamos el "token" y los datos del usuario en el navegador
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Recargamos la página. El App.js nos redirigirá al Dashboard
            window.location.reload(); 

        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <img src="/logo_saciar.png" alt="Logo Saciar" className="logo-login" />
            
                
                <div className="form-group">
                    <label htmlFor="email">Correo Electronico*</label>
                    <input 
                        type="email" 
                        id="email"
                        placeholder="Correo Electronico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Contraseña*</label>
                    <input 
                        type="password" 
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                {error && <p className="error-mensaje">{error}</p>}
                
                <button type="submit" className="login-button" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;