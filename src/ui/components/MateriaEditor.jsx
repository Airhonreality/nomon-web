import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-md-editor/markdown-preview.css";

/**
 * 🖋️ SOVEREIGN MATERIA EDITOR (Industrial Grade)
 * Sustituye la improvisación por un motor de edición profesional.
 */
export const MateriaEditor = ({ value, onChange, placeholder }) => {
    
    // Configuración de previsualización para el modo oscuro
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <div className="sovereign-editor-container" data-color-mode={isDarkMode ? 'dark' : 'light'}>
            <MDEditor
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                preview="live"
                height={400}
                visibleDragbar={true}
                className="nomon-md-editor"
            />

            <style dangerouslySetInnerHTML={{ __html: `
                .sovereign-editor-container {
                    width: 100%;
                    margin: 1rem 0;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 0.2rem;
                    overflow: hidden;
                }

                /* Personalización Estética NOMON */
                .nomon-md-editor {
                    background: #fff !important;
                    color: #000 !important;
                    box-shadow: none !important;
                    border: none !important;
                }

                [data-color-mode='dark'] .nomon-md-editor {
                    background: #0d1117 !important;
                    color: #c9d1d9 !important;
                }

                .w-md-editor-toolbar {
                    background: #f8f8f8 !important;
                    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
                }

                [data-color-mode='dark'] .w-md-editor-toolbar {
                    background: #161b22 !important;
                    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                }

                .w-md-editor-content {
                    font-family: 'Inter', sans-serif !important;
                }

                .w-md-editor-preview {
                    background: #fcfcfc !important;
                    border-left: 1px solid rgba(0,0,0,0.05) !important;
                }

                [data-color-mode='dark'] .w-md-editor-preview {
                    background: #0d1117 !important;
                    border-left: 1px solid rgba(255,255,255,0.05) !important;
                }

                /* Ocultar marca de agua de la librería para limpieza total */
                .w-md-editor-toolbar-child [aria-label="Generate Markdown"] {
                    display: none !important;
                }
            `}} />
        </div>
    );
};
