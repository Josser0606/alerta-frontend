import React, { useState } from 'react';
import API_BASE_URL from '../api/apiConfig';
import '../assets/styles/Login.css';
import logoImage from '../assets/images/logo_saciar.png';
import { BiError } from "react-icons/bi";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    // FUNCIÓN DE VALIDACIÓN MANUAL
    const validarFormulario = () => {
        if (!email.trim()) {
            setError("Por favor, ingresa tu correo electrónico.");
            return false;
        }
        if (!password.trim()) {
            setError("Por favor, ingresa tu contraseña.");
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // 1. Primero validamos localmente
        if (!validarFormulario()) {
            return; 
        }

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
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            window.location.reload(); 

        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    // Limpiar error al escribir
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    return (
        <div className="login-container">
            {/* Agregamos noValidate para apagar los mensajes del navegador */}
            <form className="login-form" onSubmit={handleLogin} noValidate>
                
                <img 
                    src={logoImage} 
                    alt="Logo Saciar" 
                    className="logo-login" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input 
                        type="email" 
                        id="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={handleEmailChange}
                        // Quitamos el 'required' nativo
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Contraseña *</label>
                    <input 
                        type="password" 
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={handlePasswordChange}
                        // Quitamos el 'required' nativo
                    />
                </div>

                {/* Aquí aparecerá TU alerta personalizada roja */}
                {error && <div className="error-mensaje"><BiError /> {error}</div>}
                
                <button type="submit" className="login-button" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;