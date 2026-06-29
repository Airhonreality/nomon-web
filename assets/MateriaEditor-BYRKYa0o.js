import{i as e,r as t,s as n,t as r}from"./esm-DuIRG8Vy.js";n();var i=e(),a=({value:e,onChange:n,placeholder:a})=>{let{state:o}=t();return(0,i.jsxs)(`div`,{className:`sovereign-editor-container`,"data-color-mode":o.theme||`dark`,children:[(0,i.jsx)(r,{value:e,onChange:n,placeholder:a,preview:`live`,height:400,visibleDragbar:!0,className:`nomon-md-editor`}),(0,i.jsx)(`style`,{dangerouslySetInnerHTML:{__html:`
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
            `}})]})};export{a as MateriaEditor};