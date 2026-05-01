import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";
import { useSovereign } from '../../score/SovereignContext.jsx';


/**
 * 🖋️ SOVEREIGN MATERIA EDITOR (Industrial Grade)
 * Sustituye la improvisación por un motor de edición profesional.
 */
export const MateriaEditor = ({ value, onChange, placeholder }) => {
    const { state } = useSovereign();
    const currentTheme = state.theme || 'dark';

    return (
        <div className="sovereign-editor-container" data-color-mode={currentTheme}>

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
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-subtle);
                    overflow: hidden;
                    background: var(--bg-primary);
                }

                /* Personalización Estética NOMON (Theme-Aware) */
                .nomon-md-editor {
                    background: var(--bg-primary) !important;
                    color: var(--text-primary) !important;
                    box-shadow: none !important;
                    border: none !important;
                }

                /* Editor Internals Adjustment */
                .w-md-editor {
                    background-color: var(--bg-primary) !important;
                    color: var(--text-primary) !important;
                }

                .w-md-editor-text-input, 
                .w-md-editor-text-pre, 
                .w-md-editor-text-pre code,
                .w-md-editor-text-input textarea {
                    color: var(--text-primary) !important;
                    -webkit-text-fill-color: var(--text-primary) !important;
                }

                .w-md-editor-toolbar {
                    background: var(--bg-secondary) !important;
                    border-bottom: 1px solid var(--border-primary) !important;
                    color: var(--text-primary) !important;
                }

                .w-md-editor-toolbar ul li button {
                    color: var(--text-primary) !important;
                }

                .w-md-editor-content {
                    font-family: 'Inter', sans-serif !important;
                    background: var(--bg-primary) !important;
                }

                .w-md-editor-preview {
                    background: var(--bg-tertiary) !important;
                    border-left: 1px solid var(--border-primary) !important;
                    color: var(--text-primary) !important;
                }

                /* Markdown specific fixes */
                .wmde-markdown {
                    background: transparent !important;
                    color: var(--text-primary) !important;
                }

                /* Ocultar marca de agua de la librería para limpieza total */
                .w-md-editor-toolbar-child [aria-label="Generate Markdown"] {
                    display: none !important;
                }
            `}} />
        </div>
    );
};
