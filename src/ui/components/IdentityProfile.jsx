import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 👤 IDENTITY PROFILE ACTOR
 * Un proyector de la soberanía personal del usuario.
 */
export const IdentityProfile = () => {
    const { state, dispatch } = useSovereign();
    const user = state.identity?.user;
    
    // Estado local para edición agnóstica
    const [bio, setBio] = useState("");
    const [tags, setTags] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Cargamos la data del perfil desde el estado (que viene del Vault)
        const profileData = state.identity?.profile_extended || {};
        setBio(profileData.bio || "Este es tu espacio soberano. Describe tu misión aquí.");
        setTags(profileData.tags || ['Ética', 'Ingeniería', 'Futuros']);
    }, [state.identity]);

    const handleSave = () => {
        dispatch('identity_update_extended', {
            bio,
            tags
        });
        setIsEditing(false);
    };

    if (!state.identity?.isLoggedIn) {
        return (
            <div className="profile-error">
                <h2>Acceso Restringido</h2>
                <p>Debes reconocer tu identidad (Login) para acceder al perfil soberano.</p>
                <button onClick={() => window.location.hash = '/admin/forge'} className="login-btn">INICIAR SESIÓN</button>
            </div>
        );
    }

    return (
        <div className="identity-profile-container">
            <header className="profile-header">
                <div className="profile-avatar">
                    {user?.handle?.label?.charAt(0) || 'N'}
                </div>
                <div className="profile-id">
                    <h1>{user?.handle?.label || 'Arquitecto'}</h1>
                    <span className="profile-email">{user?.payload?.email}</span>
                    <span className="profile-role">ROLES: {state.identity?.role}</span>
                </div>
            </header>

            <section className="profile-content">
                <div className="profile-tags">
                    {tags.map((tag, i) => (
                        <span key={i} className="tag-pill">#{tag}</span>
                    ))}
                    {isEditing && <button className="add-tag">+ AÑADIR INTERÉS</button>}
                </div>

                <div className="profile-bio-section">
                    <h3>BIOGRAFÍA Y PROYECTOS</h3>
                    {isEditing ? (
                        <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)}
                            className="bio-editor"
                        />
                    ) : (
                        <div className="bio-display">{bio}</div>
                    )}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <button onClick={handleSave} className="save-btn">CRISTALIZAR CAMBIOS</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="edit-btn">EDITAR PERFIL</button>
                    )}
                </div>
            </section>

            <style dangerouslySetInnerHTML={{ __html: `
                .identity-profile-container {
                    max-width: 60rem;
                    margin: 4rem auto;
                    padding: 2rem;
                    font-family: 'Outfit', sans-serif;
                }

                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 3rem;
                    margin-bottom: 4rem;
                }

                .profile-avatar {
                    width: 8rem;
                    height: 8rem;
                    min-width: 8rem;
                    background: #000;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 4rem;
                    font-weight: 300;
                    border-radius: 0.3rem;
                }

                .profile-id h1 {
                    font-size: 3.5rem;
                    margin: 0;
                    letter-spacing: -0.05em;
                    text-transform: uppercase;
                }

                .profile-email {
                    display: block;
                    color: #888;
                    font-size: 1.1rem;
                }

                .profile-role {
                    font-size: 0.7rem;
                    background: #f0f0f0;
                    padding: 0.2rem 0.6rem;
                    border-radius: 0.2rem;
                    font-weight: 700;
                    margin-top: 0.8rem;
                    display: inline-block;
                }

                .profile-tags {
                    margin-bottom: 3rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.8rem;
                }

                .tag-pill {
                    background: #f9f9f9;
                    padding: 0.5rem 1.2rem;
                    border-radius: 1.5rem;
                    font-size: 0.9rem;
                    color: #555;
                    border: 0.05rem solid #eee;
                }

                .profile-bio-section h3 {
                    font-size: 0.8rem;
                    letter-spacing: 0.2em;
                    color: #888;
                    border-bottom: 0.05rem solid #eee;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .bio-display {
                    font-size: 1.3rem;
                    line-height: 1.6;
                    color: #333;
                    white-space: pre-wrap;
                }

                .bio-editor {
                    width: 100%;
                    min-height: 15rem;
                    padding: 1.5rem;
                    font-family: inherit;
                    font-size: 1.2rem;
                    border: 0.05rem solid #ddd;
                    border-radius: 0.3rem;
                }

                .profile-actions {
                    margin-top: 4rem;
                }

                .edit-btn, .save-btn {
                    padding: 1.2rem 3rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    width: 100%;
                }

                @media (min-width: 768px) {
                    .edit-btn, .save-btn { width: auto; }
                }

                .profile-error {
                    text-align: center;
                    padding: 10rem 2rem;
                }

                @media (max-width: 768px) {
                    .profile-header { flex-direction: column; text-align: center; gap: 1.5rem; }
                    .profile-id h1 { font-size: 2.5rem; }
                    .identity-profile-container { margin: 2rem auto; }
                }
            `}} />
        </div>
    );
};
