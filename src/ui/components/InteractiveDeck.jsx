import React, { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

const FALLBACK_DECK = {
    slug: "simposio-deck",
    meta: {
        component_type: "SLIDESHOW_DECK"
    },
    data: {
        slides: [
            {
                id: "cover",
                title: "SIMPOSIO INTERNACIONAL DE ÉTICA",
                subtitle: "Protocolos de Integridad para la Supervivencia multi especie y la Sustentabilidad Sistémica.",
                accent: "#f37024"
            },
            {
                id: "justification",
                title: "Justificación",
                content: "Urgente articulación de academia, gobierno, industria, sociedad civil y medio ambiente. Buscamos transformar la ética discursiva en protocolos prácticos de supervivencia colectiva y controles inalterables contra la corrupción, orientando el desarrollo hacia un equilibrio sustentable.",
                emphasis: "Se espera consolidar un marco ético aplicado capaz de traducirse en una cultura institucional coherente y transparente.",
                accent: "#ffcc00"
            },
            {
                id: "objective",
                title: "Objetivo General",
                content: "Integrar a los actores de la Quíntuple Hélice para cocrear protocolos éticos y tecnologías aplicables, anticipando el cambio social y promoviendo el bienestar multiespecie mediante metodologías prospectivas del Buen Vivir.",
                accent: "#009fe3"
            },
            {
                id: "specific-objectives",
                title: "Objetivos Específicos",
                bullets: [
                    "Analizar desafíos éticos y de supervivencia en redes de vida locales e internacionales.",
                    "Identificar contribuciones estratégicas de cada sector de la Quíntuple Hélice.",
                    "Promover el diálogo pragma-dialéctico y la cocreación transdisciplinaria.",
                    "Diseñar protocolos de integridad y herramientas tecnológicas contra desviaciones.",
                    "Utilizar prospectiva aplicada para anticipar y orientar escenarios de futuro.",
                    "Establecer la sustentabilidad de largo plazo como métrica de éxito sistémico."
                ],
                accent: "#f37024"
            },
            {
                id: "methodology",
                title: "Metodología",
                subtitle: "El Diferencial Metodológico",
                content: "Superamos la conferencia clásica mediante laboratorios de cocreación en escenarios académicos, culturales y naturales, induciendo reflexiones fuera de los esquemas tradicionales de trabajo.",
                accent: "#96157f"
            },
            {
                id: "actors-1",
                title: "Actores Clave (I)",
                nodes: [
                    { "role": "NOMON SAS BIC", "desc": "Coordinación general y secretaría técnica del Simposio." },
                    { "role": "Javier García", "desc": "Diseñador especulativo: Diseño e implementación del proyecto." },
                    { "role": "Isabel Álvarez", "desc": "Coordinadora Costa Caribe: Articulación de actores clave regionales." },
                    { "role": "Marina Álvarez", "desc": "Junta directiva Club de Leones: Articulación de sociedad civil." },
                    { "role": "Dra. Nidia Sara Donado", "desc": "Presidenta Corpojueces: Panelista de Justicia y Derechos Humanos." },
                    { "role": "Alfonso Bohórquez", "desc": "Director Diseño Industrial (UNAL): Aval e integración académica." }
                ],
                accent: "#3da849"
            },
            {
                id: "actors-2",
                title: "Actores Clave (II)",
                nodes: [
                    { "role": "Isabel Cristina", "desc": "Directora Investigación (UNAL): Validación de marco y Libro Blanco." },
                    { "role": "Juan Mendoza Collazos", "desc": "Profesor UNAL: Aporte en teoría sistémica y co-creación." },
                    { "role": "Samuel Herrera", "desc": "Profesor UNAL: Implementación pedagógica de guías éticas." },
                    { "role": "Andrés Felipe Sussman", "desc": "Profesor UNAL: Co-diseño de dinámicas de diseño de vida." },
                    { "role": "Juan Sebastián Salazar", "desc": "Diseño especulativo de futuros y estética Solarpunk." },
                    { "role": "Misa", "desc": "Agente de Cultura (UNAL): Mediación cultural y performance artística." }
                ],
                accent: "#3da849"
            }
        ]
    }
};

export const InteractiveDeck = () => {
    const { state, bridge } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    
    const deckRaw = entries?.find(item => item.slug === 'simposio-deck') || FALLBACK_DECK;
    const slides = deckRaw.data?.slides || FALLBACK_DECK.data.slides;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSlides, setEditedSlides] = useState([]);
    const [indexOpen, setIndexOpen] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setEditedSlides(JSON.parse(JSON.stringify(slides)));
        }
    }, [isEditing, slides]);

    const activeSlide = slides[currentSlide] || slides[0] || {};
    const accentColor = activeSlide.accent || "#f37024";

    const handleNext = () => {
        setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
        setIndexOpen(false);
    };

    const handlePrev = () => {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
        setIndexOpen(false);
    };

    // Teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isEditing) return;
            if (e.key === 'ArrowRight' || e.key === 'Space') {
                e.preventDefault();
                handleNext();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, isEditing, slides]);

    // Táctil
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
            time: Date.now()
        });
    };

    const onTouchMove = (e) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const xDistance = touchStart.x - touchEnd.x;
        const yDistance = touchStart.y - touchEnd.y;
        const timeElapsed = Date.now() - touchStart.time;

        const isHorizontal = Math.abs(xDistance) > Math.abs(yDistance);
        const speed = Math.abs(xDistance) / (timeElapsed / 1000);
        const angleOk = Math.abs(yDistance) / Math.abs(xDistance) < 0.46;

        if (isHorizontal && Math.abs(xDistance) >= 80 && speed > 200 && angleOk) {
            if (xDistance > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    };

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const canEdit = isLocalhost || state.identity?.role === 'ADMIN' || state.identity?.isLoggedIn;

    // Editor Helpers
    const updateEditedSlideField = (index, field, value) => {
        const updated = [...editedSlides];
        if (updated[index]) {
            updated[index][field] = value;
            setEditedSlides(updated);
        }
    };

    const updateEditedBullet = (slideIndex, bulletIndex, value) => {
        const updated = [...editedSlides];
        if (updated[slideIndex] && updated[slideIndex].bullets) {
            updated[slideIndex].bullets[bulletIndex] = value;
            setEditedSlides(updated);
        }
    };

    const addEditedBullet = (slideIndex) => {
        const updated = [...editedSlides];
        if (updated[slideIndex]) {
            if (!updated[slideIndex].bullets) updated[slideIndex].bullets = [];
            updated[slideIndex].bullets.push("Nueva viñeta...");
            setEditedSlides(updated);
        }
    };

    const removeEditedBullet = (slideIndex, bulletIndex) => {
        const updated = [...editedSlides];
        if (updated[slideIndex] && updated[slideIndex].bullets) {
            updated[slideIndex].bullets.splice(bulletIndex, 1);
            setEditedSlides(updated);
        }
    };

    const updateEditedNode = (slideIndex, nodeIndex, field, value) => {
        const updated = [...editedSlides];
        if (updated[slideIndex] && updated[slideIndex].nodes) {
            updated[slideIndex].nodes[nodeIndex][field] = value;
            setEditedSlides(updated);
        }
    };

    const addEditedNode = (slideIndex) => {
        const updated = [...editedSlides];
        if (updated[slideIndex]) {
            if (!updated[slideIndex].nodes) updated[slideIndex].nodes = [];
            updated[slideIndex].nodes.push({ role: "Actor", desc: "Rol o aporte" });
            setEditedSlides(updated);
        }
    };

    const removeEditedNode = (slideIndex, nodeIndex) => {
        const updated = [...editedSlides];
        if (updated[slideIndex] && updated[slideIndex].nodes) {
            updated[slideIndex].nodes.splice(nodeIndex, 1);
            setEditedSlides(updated);
        }
    };

    const handleSaveDeck = async () => {
        const uqo = {
            protocol: 'CREATE',
            context_id: 'NOMON_ENTRIES',
            data: {
                slug: 'simposio-deck',
                meta: { component_type: 'SLIDESHOW_DECK' },
                metadata: deckRaw.metadata || { author: 'NOMON SAS BIC', year: '2026', license: 'CC BY-NC', language: 'es' },
                data: {
                    content: deckRaw.data?.content || {
                        title: { es: "Simposio de Ética" },
                        summary: { es: "Presentación interactiva para inversores del Simposio Internacional de Ética." }
                    },
                    slides: editedSlides
                }
            }
        };

        try {
            await bridge.execute(uqo);
            alert("Materia del Deck guardada en el silo local.");
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error al guardar: " + error.message);
        }
    };

    const formatIndex = (idx) => String(idx + 1).padStart(2, '0');

    return (
        <section className="deck-page-wrapper" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

                :root {
                    --deck-bg-light: #faf9f6;
                    --deck-text-dark: #121417;
                    --deck-text-gray: #4a5568;
                    --deck-border-light: #e2e8f0;
                    --font-serif: 'Playfair Display', Georgia, serif;
                    --font-sans: 'Plus Jakarta Sans', sans-serif;
                    --spacing-xs: clamp(0.5rem, calc(0.386rem + 0.57vw), 0.75rem);
                    --spacing-sm: clamp(0.75rem, calc(0.522rem + 1.14vw), 1.25rem);
                    --spacing-md: clamp(1.25rem, calc(0.909rem + 1.7vw), 2rem);
                    --spacing-lg: clamp(2rem, calc(1.09rem + 4.55vw), 4rem);
                    --spacing-xl: clamp(3rem, calc(1.182rem + 9.09vw), 7rem);
                }

                .deck-page-wrapper {
                    background-color: var(--deck-bg-light);
                    min-height: calc(100vh - 70px);
                    display: flex;
                    flex-direction: column;
                    font-family: var(--font-sans);
                    color: var(--deck-text-dark);
                    position: relative;
                    box-sizing: border-box;
                    width: 100%;
                }

                @media (min-width: 769px) {
                    .deck-page-wrapper {
                        height: 90vh;
                        max-height: 90vh;
                        overflow: hidden;
                    }
                }

                /* Layout Asimétrico 50/50 */
                .deck-layout-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    flex: 1;
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    box-sizing: border-box;
                }

                @media (min-width: 769px) {
                    .deck-layout-grid {
                        grid-template-columns: 1.1fr 0.9fr;
                        height: 100%;
                    }
                }

                /* Columna Izquierda (Pitch / Enorme) */
                .deck-col-left {
                    padding: var(--spacing-lg);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    border-bottom: 1px solid var(--deck-border-light);
                    box-sizing: border-box;
                }

                @media (min-width: 769px) {
                    .deck-col-left {
                        border-bottom: none;
                        border-right: 1px solid var(--deck-border-light);
                        padding: var(--spacing-xl) var(--spacing-lg);
                        height: 100%;
                        overflow-y: auto;
                    }
                }

                .deck-brand-header {
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--deck-text-gray);
                    margin-bottom: var(--spacing-md);
                }

                .deck-massive-title {
                    font-family: var(--font-serif);
                    font-size: clamp(2rem, calc(1.5rem + 3.2vw), 3.8rem);
                    line-height: 1.15;
                    font-weight: 800;
                    color: #000000;
                    margin: 0 0 var(--spacing-sm) 0;
                    max-width: 16ch;
                }

                .deck-accent-line {
                    width: 80px;
                    height: 4px;
                    background-color: ${accentColor};
                    transition: background-color 0.6s ease;
                    margin-bottom: var(--spacing-md);
                }

                /* Columna Derecha (Datos / Aire) */
                .deck-col-right {
                    padding: var(--spacing-lg);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    box-sizing: border-box;
                    background-color: #ffffff;
                }

                @media (min-width: 769px) {
                    .deck-col-right {
                        padding: var(--spacing-xl);
                        height: 100%;
                        overflow-y: auto;
                    }
                }

                .deck-slide-subtitle {
                    font-family: var(--font-serif);
                    font-size: clamp(1.25rem, calc(1.1rem + 0.6vw), 1.8rem);
                    line-height: 1.35;
                    font-weight: 400;
                    color: var(--deck-text-gray);
                    margin-bottom: var(--spacing-md);
                    max-width: 66ch;
                }

                .deck-slide-content {
                    font-size: clamp(0.95rem, calc(0.9rem + 0.2vw), 1.1rem);
                    line-height: 1.7;
                    color: var(--deck-text-gray);
                    margin-bottom: var(--spacing-md);
                    max-width: 66ch;
                }

                .deck-slide-emphasis {
                    font-size: 1.05rem;
                    line-height: 1.6;
                    font-weight: 600;
                    color: #000000;
                    border-left: 2px solid ${accentColor};
                    padding-left: var(--spacing-sm);
                    margin: var(--spacing-md) 0;
                    transition: border-color 0.5s ease;
                }

                /* Viñetas Limpias y Espaciosas */
                .deck-bullets-list {
                    list-style: none;
                    padding: 0;
                    margin: var(--spacing-md) 0 0 0;
                    border-top: 1px solid var(--deck-border-light);
                    padding-top: var(--spacing-md);
                }

                .deck-bullet-item {
                    position: relative;
                    padding-left: 24px;
                    margin-bottom: 16px;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: var(--deck-text-gray);
                }

                .deck-bullet-item::before {
                    content: "—";
                    position: absolute;
                    left: 0;
                    color: ${accentColor};
                    font-weight: 800;
                    transition: color 0.5s ease;
                }

                /* Bento Grid Actores */
                .deck-nodes-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-md);
                    border-top: 1px solid var(--deck-border-light);
                    padding-top: var(--spacing-md);
                }

                @media (min-width: 480px) {
                    .deck-nodes-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .deck-node-card {
                    background: var(--deck-bg-light);
                    border: 1px solid var(--deck-border-light);
                    padding: var(--spacing-sm);
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }

                .deck-node-card:hover {
                    border-color: ${accentColor};
                    background: #ffffff;
                }

                .deck-node-role {
                    font-weight: 800;
                    font-size: 0.8rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #000000;
                    margin-bottom: 4px;
                }

                .deck-node-desc {
                    font-size: 0.85rem;
                    color: var(--deck-text-gray);
                    line-height: 1.5;
                }

                /* Card de índice desplegable */
                .deck-compact-index-card {
                    position: relative;
                    margin-top: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                    z-index: 100;
                }

                .deck-index-toggle-btn {
                    background: #ffffff;
                    border: 1px solid var(--deck-border-light);
                    padding: 10px 16px;
                    border-radius: 4px;
                    font-family: var(--font-sans);
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--deck-text-dark);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 280px;
                    transition: all 0.2s ease;
                }

                .deck-index-toggle-btn:hover {
                    border-color: var(--active-accent);
                }

                .deck-index-dropdown-overlay {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    max-width: 280px;
                    background: #ffffff;
                    border: 1px solid var(--deck-border-light);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
                    border-radius: 4px;
                    margin-top: 6px;
                    max-height: 280px;
                    overflow-y: auto;
                    z-index: 200;
                    padding: 6px 0;
                }

                .deck-dropdown-item {
                    background: none;
                    border: none;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 16px;
                    cursor: pointer;
                    text-align: left;
                    font-family: var(--font-sans);
                    color: var(--deck-text-gray);
                    font-size: 0.8rem;
                    transition: all 0.15s ease;
                }

                .deck-dropdown-item:hover {
                    background: var(--deck-bg-light);
                    color: #000000;
                }

                .deck-dropdown-item.active {
                    color: #000000;
                    font-weight: 700;
                    background: var(--deck-bg-light);
                    border-left: 3px solid var(--active-accent);
                }

                .deck-dropdown-title {
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-size: 0.72rem;
                }

                .deck-index-num {
                    font-family: var(--font-serif);
                    font-weight: 850;
                    font-size: 0.9rem;
                }

                /* Controles Sutiles Integrados */
                .deck-footer-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                    padding-top: var(--spacing-sm);
                    border-top: 1px solid var(--deck-border-light);
                }

                .deck-page-indicator {
                    font-family: var(--font-serif);
                    font-size: clamp(1.2rem, 3vw, 1.8rem);
                    font-weight: 700;
                    color: #000000;
                }

                .deck-page-total {
                    font-size: 0.9rem;
                    color: var(--deck-text-gray);
                    font-weight: 400;
                }

                .deck-nav-buttons {
                    display: flex;
                    gap: 20px;
                }

                .deck-text-btn {
                    background: none;
                    border: none;
                    font-family: var(--font-sans);
                    font-size: 0.85rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--deck-text-dark);
                    cursor: pointer;
                    padding: 8px 0;
                    transition: color 0.2s ease, transform 0.2s ease;
                    touch-action: manipulation;
                }

                .deck-text-btn:active {
                    transform: scale(0.96);
                }

                @media not all and (hover: none) {
                    .deck-text-btn:hover {
                        color: ${accentColor};
                    }
                }

                /* Editor de Textos Minimalista */
                .deck-editor-card {
                    background: #ffffff;
                    border: 1px solid var(--deck-border-light);
                    padding: var(--spacing-lg);
                    max-width: 800px;
                    width: 100%;
                    margin: var(--spacing-md) auto;
                    box-sizing: border-box;
                    border-radius: 4px;
                }

                .editor-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--deck-border-light);
                    padding-bottom: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                }

                .editor-title {
                    font-family: var(--font-serif);
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0;
                }

                .form-group {
                    margin-bottom: var(--spacing-sm);
                }

                .form-label {
                    display: block;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--deck-text-gray);
                    margin-bottom: 6px;
                }

                .form-input, .form-textarea {
                    width: 100%;
                    background: var(--deck-bg-light) !important;
                    border: 1px solid var(--deck-border-light) !important;
                    color: var(--deck-text-dark) !important;
                    border-radius: 2px;
                    padding: 10px 14px;
                    font-family: var(--font-sans);
                    font-size: 0.9rem;
                    box-sizing: border-box;
                }

                .form-input:focus, .form-textarea:focus {
                    border-color: ${accentColor} !important;
                    outline: none;
                }

                .form-textarea {
                    min-height: 80px;
                    resize: vertical;
                }

                .form-row-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-sm);
                }

                .editor-bullet-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                    align-items: center;
                }

                .editor-bullet-row .form-input {
                    flex: 1;
                }

                .editor-btn-small {
                    padding: 6px 12px;
                    font-size: 0.7rem;
                }

                .editor-actor-box {
                    border: 1px solid var(--deck-border-light);
                    padding: 10px;
                    border-radius: 4px;
                    background: var(--deck-bg-light);
                    margin-bottom: 10px;
                }

                .deck-hidden-edit-trigger {
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    background: none;
                    border: none;
                    color: var(--deck-text-gray);
                    opacity: 0.12;
                    cursor: pointer;
                    transition: opacity 0.2s ease, color 0.2s ease;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999;
                }
                .deck-hidden-edit-trigger:hover {
                    opacity: 0.8;
                    color: ${accentColor};
                }
            `}} />

            {/* MODO EDICIÓN */}
            {isEditing ? (
                <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div className="deck-editor-card">
                        <div className="editor-header">
                            <div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: editedSlides[currentSlide]?.accent }}>Editor de Materia</span>
                                <h2 className="editor-title">Slide {currentSlide + 1} de {slides.length}</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="deck-text-btn editor-btn-small" onClick={() => setIsEditing(false)}>Cancelar</button>
                                <button className="deck-text-btn editor-btn-small" style={{ color: editedSlides[currentSlide]?.accent }} onClick={handleSaveDeck}>Guardar</button>
                            </div>
                        </div>

                        {editedSlides[currentSlide] && (
                            <div>
                                <div className="form-group">
                                    <label className="form-label">Título</label>
                                    <input 
                                        className="form-input" 
                                        value={editedSlides[currentSlide].title || ''} 
                                        onChange={(e) => updateEditedSlideField(currentSlide, 'title', e.target.value)} 
                                    />
                                </div>

                                <div className="form-row-grid">
                                    <div className="form-group">
                                        <label className="form-label">Acento (Hex)</label>
                                        <input 
                                            className="form-input" 
                                            value={editedSlides[currentSlide].accent || ''} 
                                            onChange={(e) => updateEditedSlideField(currentSlide, 'accent', e.target.value)} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Subtítulo / Enfoque</label>
                                        <input 
                                            className="form-input" 
                                            value={editedSlides[currentSlide].subtitle || editedSlides[currentSlide].emphasis || ''} 
                                            onChange={(e) => updateEditedSlideField(currentSlide, editedSlides[currentSlide].subtitle !== undefined ? 'subtitle' : 'emphasis', e.target.value)} 
                                        />
                                    </div>
                                </div>

                                {editedSlides[currentSlide].content !== undefined && (
                                    <div className="form-group">
                                        <label className="form-label">Contenido Principal</label>
                                        <textarea 
                                            className="form-textarea" 
                                            value={editedSlides[currentSlide].content || ''} 
                                            onChange={(e) => updateEditedSlideField(currentSlide, 'content', e.target.value)} 
                                        />
                                    </div>
                                )}

                                {editedSlides[currentSlide].bullets && (
                                    <div className="form-group">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label className="form-label">Viñetas de Información</label>
                                            <button className="deck-text-btn editor-btn-small" onClick={() => addEditedBullet(currentSlide)}>+ Añadir</button>
                                        </div>
                                        {editedSlides[currentSlide].bullets.map((bullet, idx) => (
                                            <div key={idx} className="editor-bullet-row">
                                                <input 
                                                    className="form-input" 
                                                    value={bullet} 
                                                    onChange={(e) => updateEditedBullet(currentSlide, idx, e.target.value)} 
                                                />
                                                <button 
                                                    className="deck-text-btn" 
                                                    style={{ color: '#f87171', padding: '0 8px' }} 
                                                    onClick={() => removeEditedBullet(currentSlide, idx)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {editedSlides[currentSlide].nodes && (
                                    <div className="form-group">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label className="form-label">Nodos y Actores</label>
                                            <button className="deck-text-btn editor-btn-small" onClick={() => addEditedNode(currentSlide)}>+ Añadir Actor</button>
                                        </div>
                                        {editedSlides[currentSlide].nodes.map((node, idx) => (
                                            <div key={idx} className="editor-actor-box">
                                                <div className="form-row-grid" style={{ marginBottom: '6px' }}>
                                                    <input 
                                                        className="form-input" 
                                                        placeholder="Nombre/Entidad"
                                                        value={node.role || ''} 
                                                        onChange={(e) => updateEditedNode(currentSlide, idx, 'role', e.target.value)} 
                                                    />
                                                    <button 
                                                        className="deck-text-btn" 
                                                        style={{ color: '#f87171', alignSelf: 'center' }}
                                                        onClick={() => removeEditedNode(currentSlide, idx)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                                <input 
                                                    className="form-input" 
                                                    placeholder="Descripción"
                                                    value={node.desc || ''} 
                                                    onChange={(e) => updateEditedNode(currentSlide, idx, 'desc', e.target.value)} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* MODO VISTA PRESENTACIÓN (COMPACTA Y ERGONÓMICA) */
                <div className="deck-layout-grid">
                    
                    {/* COLUMNA IZQUIERDA: EL PITCH E ÍNDICE DESPLEGABLE */}
                    <div className="deck-col-left">
                        <div>
                            <div className="deck-brand-header">NOMON / SIMPOSIO DE ÉTICA</div>
                            <h1 className="deck-massive-title">{activeSlide.title}</h1>
                            <div className="deck-accent-line"></div>
                            
                            {/* Índice Desplegable a partir de la segunda pestaña (currentSlide > 0) */}
                            {currentSlide > 0 && (
                                <div className="deck-compact-index-card">
                                    <button 
                                        className="deck-index-toggle-btn"
                                        onClick={() => setIndexOpen(!indexOpen)}
                                        style={{ '--active-accent': accentColor }}
                                    >
                                        <span>Índice de Diapositivas</span>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{indexOpen ? '▲' : '▼'}</span>
                                    </button>
                                    
                                    {indexOpen && (
                                        <div className="deck-index-dropdown-overlay">
                                            {slides.map((slide, idx) => (
                                                <button 
                                                    key={slide.id} 
                                                    className={`deck-dropdown-item ${idx === currentSlide ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setCurrentSlide(idx);
                                                        setIndexOpen(false);
                                                    }}
                                                    style={{ '--active-accent': slide.accent || '#f37024' }}
                                                >
                                                    <span className="deck-index-num">{formatIndex(idx)}</span>
                                                    <span className="deck-dropdown-title">{slide.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pie de navegación sutil */}
                        <div className="deck-footer-nav">
                            <div className="deck-page-indicator">
                                {formatIndex(currentSlide)} <span className="deck-page-total">/ {formatIndex(slides.length - 1)}</span>
                            </div>

                            <div className="deck-nav-buttons">
                                <button className="deck-text-btn" onClick={handlePrev} aria-label="Atrás">
                                    ← Atrás
                                </button>
                                <button className="deck-text-btn" onClick={handleNext} aria-label="Siguiente">
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: LOS DETALLES COMPLETAMENTE VISIBLES */}
                    <div className="deck-col-right">
                        {activeSlide.subtitle && (
                            <h3 className="deck-slide-subtitle">{activeSlide.subtitle}</h3>
                        )}
                        
                        {activeSlide.content && (
                            <p className="deck-slide-content">{activeSlide.content}</p>
                        )}
                        
                        {activeSlide.emphasis && (
                            <p className="deck-slide-emphasis">{activeSlide.emphasis}</p>
                        )}

                        {activeSlide.bullets && (
                            <ul className="deck-bullets-list">
                                {activeSlide.bullets.map((bullet, idx) => (
                                    <li key={idx} className="deck-bullet-item">{bullet}</li>
                                ))}
                            </ul>
                        )}

                        {activeSlide.nodes && (
                            <div className="deck-nodes-grid">
                                {activeSlide.nodes.map((node, idx) => (
                                    <div key={idx} className="deck-node-card">
                                        <div className="deck-node-role">{node.role}</div>
                                        <div className="deck-node-desc">{node.desc}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {canEdit && (
                            <button 
                                className="deck-hidden-edit-trigger"
                                onClick={() => setIsEditing(true)}
                                aria-label="Configuración de diapositiva"
                            >
                                <Sliders size={13} />
                            </button>
                        )}
                    </div>

                </div>
            )}
        </section>
    );
};
