import React from 'react';

/**
 * 🌌 MOTOR DE VISUALIZACIÓN RADIAL (Galaxy Engine)
 * Proyecta relaciones de materia en coordenadas polares.
 */
export const RadialMindMap = ({ centerTitle, relations = [] }) => {
    const radius = 180;
    const centerX = 250;
    const centerY = 250;

    return (
        <div className="radial-projection-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <svg width="500" height="500" viewBox="0 0 500 500" style={{ overflow: 'visible' }}>
                {/* 🔗 LÍNEAS DE RESONANCIA */}
                {relations.map((rel, idx) => {
                    const angle = (idx * (360 / relations.length)) * (Math.PI / 180);
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    return (
                        <line 
                            key={`line-${idx}`} 
                            x1={centerX} y1={centerY} x2={x} y2={y} 
                            stroke="var(--accent-color)" strokeWidth="0.5" strokeDasharray="4 4" 
                            style={{ opacity: 0.3 }}
                        />
                    );
                })}

                {/* ⚛️ NÚCLEO (Soberanía) */}
                <circle cx={centerX} cy={centerY} r="40" fill="var(--bg-primary)" stroke="var(--text-primary)" strokeWidth="2" />
                <text 
                    x={centerX} y={centerY} 
                    textAnchor="middle" dy=".3em" 
                    style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                    {centerTitle?.substring(0, 10)}...
                </text>

                {/* 🛰️ SATÉLITES (Materia Relacionada) */}
                {relations.map((rel, idx) => {
                    const angle = (idx * (360 / relations.length)) * (Math.PI / 180);
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    
                    return (
                        <g key={`sat-${idx}`} style={{ cursor: 'pointer' }} onClick={() => window.location.hash = `/materia/${rel}`}>
                            <circle cx={x} cy={y} r="25" fill="var(--bg-secondary)" stroke="var(--border-primary)" strokeWidth="1" />
                            <text 
                                x={x} y={y} 
                                textAnchor="middle" dy=".3em" 
                                style={{ fontSize: '0.45rem', fontWeight: 700, fill: 'var(--text-primary)', opacity: 0.7 }}
                            >
                                {rel?.substring(0, 8)}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <style dangerouslySetInnerHTML={{ __html: `
                .radial-projection-container svg {
                    animation: rotateGalaxy 100s linear infinite;
                }
                @keyframes rotateGalaxy {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .radial-projection-container g:hover circle {
                    stroke: var(--accent-color);
                    stroke-width: 2;
                }
                .radial-projection-container text {
                    pointer-events: none;
                }
            `}} />
        </div>
    );
};
