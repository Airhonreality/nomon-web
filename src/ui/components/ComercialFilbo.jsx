import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

// Helper de SHA-256 nativo
async function calcSha256(message) {
    const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 🛰️ COMERCIAL FILBO ACTOR
 * Portal comercial y de activación de grado industrial.
 */
export const ComercialFilbo = () => {
    const { state, bridge } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    const [activeTab, setActiveTab] = useState('PAYMENT_TAB');
    const [email, setEmail] = useState('');
    const [receiptName, setReceiptName] = useState('');
    const [receiptImage, setReceiptImage] = useState('');
    const [status, setStatus] = useState('');

    // Contadores del Comercial
    const [physicalSales, setPhysicalSales] = useState(() => {
        return parseInt(localStorage.getItem('comercial_sales_physical') || '0');
    });
    const [digitalSales, setDigitalSales] = useState(() => {
        return parseInt(localStorage.getItem('comercial_sales_digital') || '0');
    });

    const getTodayKey = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const today = getTodayKey();
        const lastReset = localStorage.getItem('comercial_last_reset_date');

        if (lastReset !== today) {
            console.log(`🌅 Nuevo día detectado (${today}). Reiniciando contadores...`);
            
            // Opcional: Guardar histórico antes de borrar
            const history = JSON.parse(localStorage.getItem('comercial_sales_history') || '[]');
            history.push({
                date: lastReset || 'N/A',
                physical: physicalSales,
                digital: digitalSales,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('comercial_sales_history', JSON.stringify(history.slice(-30))); // Guardar últimos 30 días

            setPhysicalSales(0);
            setDigitalSales(0);
            localStorage.setItem('comercial_last_reset_date', today);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comercial_sales_physical', physicalSales.toString());
    }, [physicalSales]);

    useEffect(() => {
        localStorage.setItem('comercial_sales_digital', digitalSales.toString());
    }, [digitalSales]);


    const inventory = entries || [];
    const fixedWhitelistSlug = "digital-sextante";

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Comprimir/Convertir a Base64 si es posible
        const reader = new FileReader();
        reader.onload = (evt) => {
            setReceiptImage(evt.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleActivateEmail = async (e) => {
        e.preventDefault();
        if (!state.identity?.isLoggedIn) {
            alert("Error: Debes iniciar sesión como asesor comercial para activar accesos.");
            return;
        }

        if (!email.trim()) {
            alert("Por favor ingresa el correo del comprador.");
            return;
        }

        setStatus('Procesando activación...');
        try {
            // Buscamos la whitelist fija
            const wlEntity = inventory.find(i => i.slug === fixedWhitelistSlug);
            if (!wlEntity) {
                setStatus('❌ Error: No se encontró la whitelist "digital-sextante".');
                return;
            }

            // Calculamos el hash SHA-256 del email del comprador
            const hash = await calcSha256(email);

            // Evitamos duplicados
            const currentHashes = wlEntity.data?.whitelist || [];
            if (currentHashes.includes(hash)) {
                setStatus('ℹ️ El usuario ya está autorizado en esta whitelist.');
                return;
            }

            const updatedHashes = [...currentHashes, hash];

            // Capturamos la identidad del comercial que realiza la acción
            const comercialEmail = state.identity?.user?.payload?.email || "asesor_anonimo";

            const currentActivations = wlEntity.data?.activations || [];
            const updatedActivations = [
                ...currentActivations,
                { hash, by: comercialEmail, timestamp: new Date().toISOString(), buyer: email, receipt_name: receiptName, receipt_image: receiptImage }
            ];

            // Invocamos el puente para guardar en GitHub
            const uqo = {
                protocol: 'CREATE',
                context_id: 'NOMON_ENTRIES',
                data: {
                    ...wlEntity,
                    data: {
                        ...wlEntity.data,
                        whitelist: updatedHashes,
                        activations: updatedActivations
                    }
                }
            };

            await bridge.execute(uqo);
            setStatus(`✨ ¡Activación Completada Exitosamente por ${comercialEmail}!`);
            setEmail('');
            setReceiptName('');
            setReceiptImage('');
        } catch (err) {
            console.error(err);
            setStatus('❌ Fallo al activar el usuario en GitHub.');
        }
    };

    const handleRegisterReceipt = async () => {
        if (!state.identity?.isLoggedIn) {
            alert("Error: Debes iniciar sesión como asesor comercial para registrar comprobantes.");
            return;
        }
        if (!receiptName.trim() && !receiptImage) {
            alert("Por favor ingresa el nombre o sube la foto del comprobante.");
            return;
        }
        setStatus('Guardando comprobante en la lista...');
        try {
            const wlEntity = inventory.find(i => i.slug === fixedWhitelistSlug);
            if (!wlEntity) {
                setStatus('❌ Error: No se encontró la whitelist "digital-sextante".');
                return;
            }

            const comercialEmail = state.identity?.user?.payload?.email || "asesor_anonimo";
            const currentActivations = wlEntity.data?.activations || [];
            const updatedActivations = [
                ...currentActivations,
                { hash: '', by: comercialEmail, timestamp: new Date().toISOString(), buyer: 'Solo Registro de Pago', receipt_name: receiptName, receipt_image: receiptImage }
            ];

            const uqo = {
                protocol: 'CREATE',
                context_id: 'NOMON_ENTRIES',
                data: {
                    ...wlEntity,
                    data: {
                        ...wlEntity.data,
                        activations: updatedActivations
                    }
                }
            };

            await bridge.execute(uqo);
            setStatus(`✨ ¡Comprobante guardado por ${comercialEmail}!`);
            setReceiptName('');
            setReceiptImage('');
        } catch (err) {
            console.error(err);
            setStatus('❌ Fallo al guardar el comprobante en GitHub.');
        }
    };

    return (
        <div className="comercial-filbo-viewport">
            <div className="comercial-wrapper">
                <header className="comercial-header">
                    <h1 className="header-title">SATELLITE // COMERCIAL FILBO</h1>
                    <p className="header-subtitle">Onboarding en vivo y activación de accesos premium</p>
                </header>

                {state.identity?.isLoggedIn && (
                    <div style={{ background: '#f0f9ff', border: '1px solid #b9e6fe', padding: '1rem', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#026aa2' }}>
                            💼 ASESOR COMERCIAL ACTIVO: {state.identity.user?.payload?.email || 'CONECTADO'}
                        </span>
                        <span style={{ fontSize: '0.6rem', color: '#026aa2', opacity: 0.8 }}>Sesión Validada</span>
                    </div>
                )}

                {/* 🧮 CONTROLES ESPECIALIZADOS DEL ASESOR */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1.5rem', background: '#fff', border: '1px solid #eee', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 4rem 8rem rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRight: '1px solid #f0f0f0', paddingRight: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.1em', opacity: 0.5, display: 'block' }}>VENTAS LIBROS FÍSICOS</span>
                            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#000' }}>{physicalSales}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <button onClick={() => setPhysicalSales(physicalSales + 1)} style={{ background: '#000', color: '#fff', border: 'none', width: '2.5rem', height: '2.5rem', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>↑</button>
                            <button onClick={() => setPhysicalSales(Math.max(0, physicalSales - 1))} style={{ background: '#fff', color: '#000', border: '1px solid #ddd', width: '2.5rem', height: '2.5rem', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>↓</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.1em', opacity: 0.5, display: 'block' }}>VENTAS LIBROS DIGITALES</span>
                            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#000' }}>{digitalSales}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <button onClick={() => setDigitalSales(digitalSales + 1)} style={{ background: '#000', color: '#fff', border: 'none', width: '2.5rem', height: '2.5rem', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>↑</button>
                            <button onClick={() => setDigitalSales(Math.max(0, digitalSales - 1))} style={{ background: '#fff', color: '#000', border: '1px solid #ddd', width: '2.5rem', height: '2.5rem', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>↓</button>
                        </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #f0f0f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 900, opacity: 0.4, letterSpacing: '0.05em' }}>
                            🗓️ JORNADA ACTIVA: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.55rem', background: '#000', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '2px', fontWeight: 'bold' }}>
                            ID SESIÓN: {getTodayKey()}
                        </span>
                    </div>


                    <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.5, letterSpacing: '0.1em' }}>
                            REGISTRAR COMPROBANTE DE PAGO (CÁMARA / GALERÍA)
                        </label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: '1' }}>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    capture="environment"
                                    onChange={handleFileChange}
                                    style={{ fontSize: '0.65rem' }} 
                                />
                                {receiptImage && <span style={{ fontSize: '0.6rem', color: '#15803d', fontWeight: 'bold' }}>📸 ¡Imagen Cargada!</span>}
                            </div>
                            <button 
                                type="button"
                                onClick={handleRegisterReceipt}
                                style={{ background: '#000', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', height: '48px' }}
                            >
                                REGISTRAR COMPROBANTE
                            </button>
                        </div>
                    </div>

                </div>

                <div className="comercial-tabs">
                    <button 
                        onClick={() => setActiveTab('PAYMENT_TAB')} 
                        className={`tab-trigger ${activeTab === 'PAYMENT_TAB' ? 'active' : ''}`}
                    >
                        💳 1. QR DE PAGO ESTÁTICO
                    </button>
                    <button 
                        onClick={() => setActiveTab('ACTIVATION_TAB')} 
                        className={`tab-trigger ${activeTab === 'ACTIVATION_TAB' ? 'active' : ''}`}
                    >
                        🔑 2. REGISTRO & ACTIVACIÓN MANUAL
                    </button>
                </div>

                <div className="comercial-panel-container">
                    {activeTab === 'PAYMENT_TAB' ? (
                        <div className="payment-tab-content animate-fade-up">
                            <div className="qr-visual-block">
                                <img src="/assets/qr_payment.png" alt="QR DE PAGO" style={{ width: '100%', maxWidth: '180px', height: 'auto', display: 'block', borderRadius: '8px' }} />
                                <span className="qr-label" style={{ marginTop: '0.8rem' }}>CÓDIGO QR DE PAGO</span>
                            </div>
                            <div className="payment-instructions">
                                <h3>💸 INSTRUCCIONES DE COBRO</h3>
                                <p>1. Presenta el código QR de pago al comprador.</p>
                                <p>2. Valida la transacción manualmente en la pasarela o aplicación de tu banco.</p>
                                <p>3. Una vez confirmado, ve a la pestaña **2. Registro & Activación Manual** para otorgar los accesos de forma instantánea.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="activation-tab-content animate-fade-up">
                            {!state.identity?.isLoggedIn ? (
                                <div style={{ background: '#fff4f4', padding: '2rem', border: '1px solid #ffebeb', borderRadius: '4px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.8rem' }}>⚠️</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#d32f2f', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>
                                        ACCESO RESTRINGIDO A ASESORES
                                    </span>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0' }}>
                                        Para realizar activaciones manuales en vivo, debes haber iniciado sesión con tu cuenta de Google en la barra de navegación del portal.
                                    </p>
                                </div>
                            ) : (
                                <div className="activation-grid">
                                    {/* Componente 1: QR para Registrarse en la Web */}
                                    <div className="qr-register-card">
                                        <img src="/assets/QR_rednomon.png" alt="QR REGISTRO" style={{ width: '100%', maxWidth: '120px', height: 'auto', display: 'block', borderRadius: '8px', marginBottom: '1rem' }} />
                                        <h4>REGISTRO DE NUEVO USUARIO</h4>
                                        <p>Pídele al cliente que escanee este código para ir a la página de registro con Google.</p>
                                        <a href="/" target="_blank" className="qr-link">Abrir Página de Registro</a>
                                    </div>

                                    {/* Componente 2: Activador manual */}
                                    <form className="activation-form" onSubmit={handleActivateEmail}>
                                        <h3>🚀 ACTIVACIÓN DE ACCESO MANUAL</h3>
                                        <p className="form-info">Ingresa el correo del comprador para añadirlo directamente a la lista blanca del libro.</p>
                                        
                                        <div className="form-field">
                                            <label>CORREO ELECTRÓNICO DEL COMPRADOR</label>
                                            <input 
                                                type="email" 
                                                placeholder="ejemplo@gmail.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required 
                                                style={{ width: '100%', boxSizing: 'border-box' }}
                                            />
                                        </div>

                                        <button type="submit" className="submit-activation">
                                            VINCULAR & ACTIVAR ACCESO EN VIVO
                                        </button>

                                        {status && <p className="activation-status">{status}</p>}
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .comercial-filbo-viewport {
                    min-height: 100vh;
                    background: #fafafa;
                    color: #000;
                    padding: 2rem 5%;
                    font-family: 'Outfit', sans-serif;
                    box-sizing: border-box;
                }

                .comercial-wrapper {
                    width: 100%;
                    max-width: 65rem;
                    margin: 0 auto;
                    box-sizing: border-box;
                }

                .comercial-header {
                    margin-bottom: 2rem;
                }

                .header-title { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.25em; color: #666; margin: 0; }
                .header-subtitle { font-size: 1.4rem; font-weight: 900; letter-spacing: -0.02em; margin-top: 0.5rem; color: #000; line-height: 1.2; }

                .comercial-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    border-bottom: 2px solid #eee;
                    margin-bottom: 2rem;
                }

                .tab-trigger {
                    background: none; border: none; padding: 1rem;
                    font-size: 0.65rem; font-weight: 900; letter-spacing: 0.05em; cursor: pointer;
                    color: #999; border-bottom: 2px solid transparent; margin-bottom: -2px;
                    transition: all 0.3s ease; text-transform: uppercase;
                    flex: 1 1 auto; text-align: center;
                }

                .tab-trigger.active {
                    color: #000; border-bottom-color: #000;
                }

                .comercial-panel-container {
                    background: #fff; border: 1px solid #eee; padding: 1.5rem;
                    box-shadow: 0 4rem 8rem rgba(0,0,0,0.03);
                    box-sizing: border-box;
                    width: 100%;
                }

                .payment-tab-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .qr-visual-block {
                    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                    background: #fafafa; border: 1px solid #eee; padding: 1.5rem;
                    width: 100%; box-sizing: border-box;
                }

                .qr-label { font-size: 0.55rem; font-weight: 900; letter-spacing: 0.15em; color: #888; }

                .payment-instructions h3 { font-size: 0.95rem; font-weight: 900; letter-spacing: 0.05em; margin-bottom: 0.8rem; }
                .payment-instructions p { font-size: 0.8rem; opacity: 0.7; line-height: 1.5; }

                .activation-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    width: 100%;
                    box-sizing: border-box;
                }

                .qr-register-card {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    background: #fafafa; border: 1px solid #eee; padding: 1.5rem; text-align: center;
                    width: 100%; box-sizing: border-box;
                }

                .qr-register-card h4 { font-size: 0.8rem; font-weight: 900; margin: 1rem 0 0.5rem 0; letter-spacing: 0.05em; }
                .qr-register-card p { font-size: 0.7rem; opacity: 0.6; line-height: 1.5; margin-bottom: 1rem; }

                .qr-link {
                    font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: #000; text-decoration: none;
                    border-bottom: 1px solid #000; padding-bottom: 0.2rem;
                }

                .activation-form { display: flex; flex-direction: column; gap: 1.2rem; width: 100%; box-sizing: border-box; }
                .activation-form h3 { font-size: 0.95rem; font-weight: 900; margin: 0; }
                .form-info { font-size: 0.7rem; opacity: 0.6; margin: 0 0 0.5rem 0; line-height: 1.5; }

                .form-field { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
                .form-field label { font-size: 0.55rem; font-weight: 900; opacity: 0.5; letter-spacing: 0.1em; }
                .form-field input, .form-field select {
                    padding: 0.8rem; border: 1px solid #ddd; font-size: 0.8rem; background: #fff; width: 100%; box-sizing: border-box;
                }

                .submit-activation {
                    background: #000; color: #fff; border: none; padding: 1rem; font-size: 0.65rem;
                    font-weight: 900; cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase;
                    transition: background 0.3s;
                    width: 100%; box-sizing: border-box;
                }

                .submit-activation:hover { background: #333; }

                .activation-status {
                    font-size: 0.7rem; font-weight: 900; color: #d32f2f; margin-top: 0.5rem;
                }

                .animate-fade-up {
                    animation: fadeUp 0.6s ease forwards;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(1rem); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media(min-width: 768px) {
                    .comercial-filbo-viewport { padding: 3rem 5%; }
                    .comercial-panel-container { padding: 3rem; }
                    .payment-tab-content { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; align-items: center; }
                    .activation-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; }
                    .tab-trigger { flex: 0 1 auto; padding: 1.2rem 2rem; font-size: 0.7rem; }
                    .header-subtitle { font-size: 1.6rem; }
                }
            `}} />
        </div>
    );
};
