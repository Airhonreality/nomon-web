import React, { useState } from 'react';
import { appState } from '../../score/AppState.js';
import { X } from 'lucide-react';

// Calcula SHA-256 nativo (mismo helper que usaba Navbar con Google)
async function calcSha256(message) {
    const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * AUTH MODAL — Registro / Acceso con email propio.
 * Reemplaza Google Sign-In. Usa appState.setIdentity() con la misma estructura.
 * Props:
 *   onClose: () => void
 */
export const AuthModal = ({ onClose }) => {
    const [tab, setTab] = useState('register'); // 'register' | 'login'
    const [form, setForm] = useState({ name: '', email: '', alias: '' });
    const [status, setStatus] = useState(null); // null | 'loading' | 'error' | 'success'
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        const email = form.email.trim().toLowerCase();
        if (!email || (!form.name.trim() && tab === 'register')) {
            setErrorMsg('Por favor completa todos los campos requeridos.');
            setStatus('error');
            return;
        }

        try {
            const emailHash = await calcSha256(email);

            // Construimos la misma estructura que Google generaba
            appState.setIdentity({
                id: emailHash,              // SHA-256 del email como ID determinístico
                email,
                email_hash: emailHash,
                name: form.name.trim() || email.split('@')[0],
                alias: form.alias.trim() || email.split('@')[0],
                picture: null,
                role: 'ALLY'
            });

            setStatus('success');
            setTimeout(() => onClose(), 800);
        } catch (err) {
            setErrorMsg('Error al procesar el acceso. Intenta de nuevo.');
            setStatus('error');
        }
    };

    return (
        <div className="auth-modal-backdrop" onClick={onClose}>
            <div className="auth-modal-panel" onClick={e => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={onClose} aria-label="Cerrar">
                    <X size={18} />
                </button>

                <div className="auth-modal-brand">NOMON</div>
                <p className="auth-modal-subtitle">
                    {tab === 'register' ? 'Únete a la red de acción.' : 'Bienvenido de regreso.'}
                </p>

                <div className="auth-tab-switcher">
                    <button
                        className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => { setTab('register'); setStatus(null); setErrorMsg(''); }}
                    >
                        Registrarme
                    </button>
                    <button
                        className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => { setTab('login'); setStatus(null); setErrorMsg(''); }}
                    >
                        Ya tengo cuenta
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {tab === 'register' && (
                        <>
                            <div className="auth-field">
                                <label htmlFor="auth-name">Nombre completo</label>
                                <input
                                    id="auth-name"
                                    name="name"
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="auth-alias">Alias (opcional)</label>
                                <input
                                    id="auth-alias"
                                    name="alias"
                                    type="text"
                                    placeholder="Cómo te llamamos"
                                    value={form.alias}
                                    onChange={handleChange}
                                    autoComplete="nickname"
                                />
                            </div>
                        </>
                    )}

                    <div className="auth-field">
                        <label htmlFor="auth-email">Correo electrónico</label>
                        <input
                            id="auth-email"
                            name="email"
                            type="email"
                            placeholder="tu@correo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    {errorMsg && <p className="auth-error-msg">{errorMsg}</p>}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={status === 'loading' || status === 'success'}
                    >
                        {status === 'loading' && 'Procesando...'}
                        {status === 'success' && '✓ Acceso concedido'}
                        {(status === null || status === 'error') && (tab === 'register' ? 'Unirme a NOMON' : 'Ingresar')}
                    </button>
                </form>

                <p className="auth-disclaimer">
                    Al continuar, aceptas los términos de uso y la política de privacidad de NOMON.
                </p>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .auth-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.55);
                    backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    animation: authBackdropIn 0.25s ease forwards;
                }

                @keyframes authBackdropIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .auth-modal-panel {
                    background: var(--bg-primary, #fff);
                    border: 1px solid var(--border-primary, #e5e7eb);
                    border-radius: 4px;
                    width: 100%;
                    max-width: 420px;
                    padding: 2.5rem 2.5rem 2rem;
                    position: relative;
                    animation: authPanelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.15);
                }

                @keyframes authPanelIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .auth-modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary, #6b7280);
                    display: flex;
                    align-items: center;
                    padding: 0.25rem;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }
                .auth-modal-close:hover { opacity: 1; }

                .auth-modal-brand {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.8rem;
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    color: var(--text-primary, #111);
                    margin-bottom: 0.4rem;
                }

                .auth-modal-subtitle {
                    font-size: 0.9rem;
                    color: var(--text-secondary, #6b7280);
                    margin: 0 0 1.8rem;
                    font-weight: 400;
                }

                .auth-tab-switcher {
                    display: flex;
                    border-bottom: 1px solid var(--border-primary, #e5e7eb);
                    margin-bottom: 1.8rem;
                    gap: 0;
                }

                .auth-tab-btn {
                    background: none;
                    border: none;
                    border-bottom: 2px solid transparent;
                    padding: 0.6rem 1rem 0.5rem;
                    font-size: 0.78rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                    color: var(--text-secondary, #9ca3af);
                    margin-bottom: -1px;
                    transition: color 0.2s, border-color 0.2s;
                }

                .auth-tab-btn.active {
                    color: var(--text-primary, #111);
                    border-bottom-color: var(--text-primary, #111);
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.1rem;
                }

                .auth-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .auth-field label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text-secondary, #6b7280);
                }

                .auth-field input {
                    padding: 0.75rem 1rem;
                    font-size: 0.95rem;
                    border-radius: 3px;
                    font-family: inherit;
                    transition: border-color 0.2s;
                }

                .auth-field input:focus {
                    border-color: #002d62 !important;
                }

                .auth-error-msg {
                    font-size: 0.8rem;
                    color: #dc2626;
                    margin: 0;
                    padding: 0.6rem 0.8rem;
                    background: rgba(220, 38, 38, 0.05);
                    border-radius: 3px;
                    border-left: 2px solid #dc2626;
                }

                .auth-submit-btn {
                    margin-top: 0.5rem;
                    background: #002d62;
                    color: #fff;
                    border: none;
                    padding: 0.9rem 1.5rem;
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    border-radius: 3px;
                    transition: background 0.2s, transform 0.2s;
                }

                .auth-submit-btn:hover:not(:disabled) {
                    background: #003d80;
                    transform: translateY(-1px);
                }

                .auth-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .auth-disclaimer {
                    font-size: 0.7rem;
                    color: var(--text-secondary, #9ca3af);
                    text-align: center;
                    margin: 1.2rem 0 0;
                    line-height: 1.5;
                }
            `}} />
        </div>
    );
};
