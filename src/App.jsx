import React from 'react';
import { SovereignRouter } from './ui/SovereignRouter.jsx';
import { Navbar } from './ui/components/Navbar.jsx';
import { useSovereign } from './score/SovereignContext.jsx';

const App = () => {
    const { state } = useSovereign();
    const navDef = state.inventory?.find(ex => (ex?.meta?.component_id || ex?.metadata?.component_id) === 'main_navbar');

    return (
        <div className="indra-satellite-viewport">
            {navDef && <Navbar definition={navDef} />}
            <SovereignRouter />
            {/* Capas de utilidad global (opcionales) */}
            <div id="auth-overlay"></div>
        </div>
    );
};

export default App;
