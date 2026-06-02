import React, { lazy, Suspense } from 'react';

// Carga perezosa del editor pesado
const MateriaEditor = lazy(() => import('../../MateriaEditor.jsx'));

export const FieldMarkdown = ({ value, onChange }) => {
    return (
        <Suspense fallback={
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', opacity: 0.5 }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 900 }}>DESPLEGANDO MOTOR DE TEXTO...</span>
            </div>
        }>
            <MateriaEditor value={value} onChange={onChange} />
        </Suspense>
    );
};
