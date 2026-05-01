import React, { useState } from 'react';
import { Link as LinkIcon, Upload, Sparkles, FileText } from 'lucide-react';

/**
 * 🛰️ MATERIA LINKER (Agnostic Connection Cell - V2 Simplified)
 * Un módulo universal para vincular recursos. Sin botones redundantes.
 */
export const MateriaLinker = ({ value, onChange, label = "Vincular Recurso" }) => {

    const [isDragging, setIsDragging] = useState(false);
    const [mode, setMode] = useState('URL'); 

    const [isUploading, setIsUploading] = useState(false);

    const normalizeFilename = (name) => {
        const parts = name.split('.');
        const extension = parts.pop();
        const baseName = parts.join('.');
        const cleanName = baseName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        return `${cleanName}.${extension.toLowerCase()}`;
    };

    const processFile = async (file) => {
        if (!file) return;
        setIsUploading(true);
        const safeName = normalizeFilename(file.name);
        
        try {
            console.log(`📡 [Protocolo Nomon] Iniciando cristalización física de: ${safeName}...`);
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'x-filename': safeName },
                body: file
            });
            
            const data = await response.json();
            if (data.url) {
                onChange(data.url);
                setMode('URL');
                console.log(`✅ [Silo] Materia cristalizada con éxito en: ${data.url}`);
            }
        } catch (err) {
            console.error("❌ [Error de Soberanía] Fallo en la transferencia física:", err);
            // Fallback: al menos generamos la ruta aunque el movimiento físico falle
            onChange(`/assets/materia/${safeName}`);
            setMode('URL');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        else setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) processFile(files[0]);
    };

    return (
        <div className={`materia-linker ${isDragging ? 'dragging' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <div className="linker-header">
                <span className="linker-label">{label}</span>
                <div className="linker-modes">
                    <button type="button" onClick={() => setMode('URL')} className={mode === 'URL' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <LinkIcon size={12} strokeWidth={2.5} /> LINK
                    </button>
                    <button type="button" onClick={() => setMode('UPLOAD')} className={mode === 'UPLOAD' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Upload size={12} strokeWidth={2.5} /> ARCHIVO
                    </button>
                </div>

            </div>

            <div className="linker-body">
                {mode === 'URL' ? (
                    <div className="url-input-zone">
                        <input 
                            type="text" 
                            value={value || ''} 
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Ruta del recurso (/assets/materia/...)"
                            style={{ width: '100%', padding: '1rem', border: '1px solid #eee', background: '#fafafa', fontFamily: 'monospace' }}
                        />
                    </div>
                ) : (
                    <div className="upload-zone">
                        <input type="file" id="file-upload" onChange={(e) => processFile(e.target.files[0])} style={{ display: 'none' }} />
                        <label htmlFor="file-upload" className="upload-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            {isUploading ? <Sparkles size={24} className="animate-pulse" /> : <Upload size={24} style={{ opacity: 0.2 }} />}
                            <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                                {isUploading ? 'CRISTALIZANDO MATERIA...' : (isDragging ? '¡SUELTA LA MATERIA!' : 'ARRASTRA AQUÍ O SELECCIONA ARCHIVO')}
                            </span>
                        </label>

                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .materia-linker { border: 1px dashed rgba(0,0,0,0.1); padding: 1.2rem; background: #fff; transition: all 0.3s ease; }
                .materia-linker.dragging { border-color: #000; background: #f8f8f8; }
                .linker-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .linker-label { font-size: 0.65rem; font-weight: 900; opacity: 0.4; letter-spacing: 0.15em; }
                .linker-modes { display: flex; gap: 0.5rem; }
                .linker-modes button { background: none; border: none; font-size: 0.6rem; font-weight: 900; cursor: pointer; opacity: 0.3; }
                .linker-modes button.active { opacity: 1; border-bottom: 2px solid #000; }
                .upload-label { display: block; padding: 2rem; text-align: center; font-size: 0.7rem; font-weight: 900; cursor: pointer; background: #fdfdfd; border: 1px solid #eee; border-style: dotted; }
            `}} />
        </div>
    );
};
