/**
 * 🌐 INDRA AGNOSTIC TRANSLATOR (v1.0)
 * Responsabilidad: Extraer el texto correcto de un objeto multilingüe.
 * Axioma: Si el idioma solicitado no existe, buscar el fallback (es/en).
 */

import { appState } from '../AppState.js';

export const Translator = {
    /**
     * Obtiene el texto traducido de un campo de contenido.
     * @param {Object|String} field - El campo del contrato (ej: {es: '...', en: '...'})
     * @returns {String} El texto en el idioma activo.
     */
    get(field) {
        // Si es un string plano (sin traducciones), devolverlo tal cual
        if (typeof field === 'string') return field;
        
        if (!field || typeof field !== 'object') return '';

        const currentLang = appState.get().lang || 'es';
        
        // 1. Intentar el idioma actual
        if (field[currentLang]) return field[currentLang];

        // 2. Fallbacks canónicos
        const fallbacks = ['es', 'en'];
        for (const lang of fallbacks) {
            if (field[lang]) return field[lang];
        }

        // 3. Si no hay nada, devolver el primer valor disponible
        const values = Object.values(field);
        return values.length > 0 ? values[0] : '';
    },

    /**
     * Inyecta variables en un texto traducido.
     * Uso: Translator.inject(data.welcome, { name: 'Javier' })
     */
    inject(field, variables = {}) {
        let text = this.get(field);
        Object.entries(variables).forEach(([key, value]) => {
            text = text.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        return text;
    }
};
