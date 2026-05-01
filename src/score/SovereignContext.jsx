import React, { createContext, useContext, useState, useEffect } from 'react';
import { appState } from './AppState.js';
import { NomonBridge } from './logic/NomonBridge.js';

console.log("🧬 [Module] SovereignContext.jsx CARGADO FISICAMENTE.");

const SovereignContext = createContext();

export const SovereignProvider = ({ children }) => {
    const [state, setState] = useState(appState.get());

    console.log("🏛️ [Provider:BODY] Ejecutando render del Provider.");

    useEffect(() => {
        console.log("📡 [SovereignContext] Iniciando suscripción al AppState...");

        const unsubscribe = appState.subscribe(newState => {
            console.log("🧠 [SovereignContext] Estado actualizado en React.");
            setState(newState);
        });
        return () => unsubscribe();
    }, []);

    const dispatch = (action, payload) => {
        if (action === 'inventory_update_component') {
            const newInventory = state.inventory.map(item => {
                const itemId = item.meta?.component_id || item.metadata?.component_id;
                if (itemId === payload.id) {
                    return { ...item, data: payload.data };
                }
                return item;
            });
            appState.update({ inventory: newInventory });
        } else if (action === 'identity_update_extended') {
            const newIdentity = { 
                ...state.identity, 
                profile_extended: payload 
            };
            appState.update({ identity: newIdentity }, true);
        } else {
            appState.update({ [action]: payload });
        }
    };

    const toggleTheme = () => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        appState.update({ theme: newTheme }, true);
    };

    const bridge = React.useMemo(() => new NomonBridge(), []);

    // 🔐 HIDRATACIÓN DE LA BÓVEDA (Sovereign Vault)
    // Cuando el usuario inicia sesión, solicitamos la llave a Vercel
    useEffect(() => {
        if (state.identity?.isLoggedIn && state.identity?.user?.email) {
            bridge.hydrateVault(state.identity.user.email);
        }
    }, [state.identity?.isLoggedIn, state.identity?.user?.email, bridge]);

    const value = React.useMemo(() => ({
        state,
        bridge,
        dispatch,
        toggleTheme
    }), [state, bridge]);


    // console.log(`🏛️ [Provider:Render] Bridge disponible: ${!!bridge} | Items en inventario: ${state.inventory?.length}`);


    return (
        <SovereignContext.Provider value={value}>
            {children}
        </SovereignContext.Provider>
    );
};

export const useSovereign = () => {
    const context = useContext(SovereignContext);
    if (!context) throw new Error("useSovereign debe usarse dentro de SovereignProvider");
    return context;
};
