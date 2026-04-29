import React from 'react';
import { createRoot } from 'react-dom/client';
import { SovereignProvider } from './score/SovereignContext.jsx';
import App from './App.jsx';

// 🔥 Ignición Soberana
const container = document.getElementById('app-root');
console.log("🚀 [Ignition] Contenedor encontrado. Proyectando realidad...");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <SovereignProvider>
            <App />
        </SovereignProvider>
    </React.StrictMode>
);
