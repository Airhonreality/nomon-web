import React from 'react';
import { SovereignRouter } from './ui/SovereignRouter.jsx';
import { Navbar } from './ui/components/Navbar.jsx';
import { useSovereign } from './score/SovereignContext.jsx';

const App = () => {
    const { state } = useSovereign();
    const navDef = state.inventory?.find(ex => (ex?.meta?.component_id || ex?.metadata?.component_id) === 'main_navbar');

    return (
        <div className={`indra-satellite-viewport theme-${state.theme || 'dark'}`}>
            {navDef && <Navbar definition={navDef} />}
            <div className="main-content-container">
                <SovereignRouter />
            </div>
            <div id="auth-overlay"></div>

            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    margin: 0;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    transition: background 0.3s ease, color 0.3s ease;
                }

                .indra-satellite-viewport {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }

                /* 🛰️ GLOBAL AGNOSTIC FIXES */
                .main-navbar {
                    background: var(--bg-primary) !important;
                    border-bottom: 1px solid var(--border-primary) !important;
                }

                input, select, textarea {
                    background: var(--bg-secondary) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-primary) !important;
                    outline: none;
                }

                ::placeholder {
                    color: var(--text-secondary);
                    opacity: 0.5;
                }

                /* Forja V5 Theme Adjustments */
                .forge-sidebar {
                    background: var(--bg-secondary) !important;
                    border-right: 1px solid var(--border-primary) !important;
                }
                
                .forge-main-editor {
                    background: var(--bg-primary) !important;
                }
            `}} />
        </div>
    );

};

export default App;
