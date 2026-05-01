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
                :root {
                    --bg-primary: #ffffff;
                    --text-primary: #000000;
                    --border-primary: #eeeeee;
                    --bg-secondary: #fcfcfc;
                    --accent-color: #000000;
                }

                .theme-dark {
                    --bg-primary: #000000;
                    --text-primary: #ffffff;
                    --border-primary: #222222;
                    --bg-secondary: #0a0a0a;
                    --accent-color: #ffffff;
                }

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
                }

                .main-navbar {
                    background: var(--bg-primary) !important;
                    border-bottom: 1px solid var(--border-primary) !important;
                    color: var(--text-primary) !important;
                }

                .nav-logo { color: var(--text-primary) !important; }
                .nav-links li { color: var(--text-primary) !important; }

                /* Forja V5 Theme Adjustments */
                .materia-forge-v5 {
                    background: var(--bg-primary) !important;
                    color: var(--text-primary) !important;
                }
                .forge-sidebar {
                    background: var(--bg-secondary) !important;
                    border-right: 1px solid var(--border-primary) !important;
                }
                .forge-sidebar div {
                    border-bottom: 1px solid var(--border-primary) !important;
                }
                .forge-main-editor {
                    background: var(--bg-primary) !important;
                }
                
                input, select, textarea {
                    background: var(--bg-primary) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border-primary) !important;
                }

                .editor-body h4, .editor-body label {
                    color: var(--text-primary) !important;
                }
            `}} />
        </div>
    );

};

export default App;
