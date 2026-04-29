/**
 * 📝 MARKDOWN BLOCK COMPONENT (v1.0)
 * Responsabilidad: Proyectar contenido rico (Notion-style).
 */

import { Translator } from '../../score/logic/Translator.js';

export class MarkdownBlock {
    constructor(definition) {
        this.meta = definition.meta;
        this.data = definition.data.content;
    }

    render() {
        const div = document.createElement('div');
        div.id = this.meta.component_id;
        div.className = 'indra-markdown-block';

        // En una implementación real usaríamos 'marked' o similar.
        // Por ahora, inyectamos el contenido respetando saltos de línea básicos.
        const bodyText = Translator.get(this.data.body);
        
        div.innerHTML = `
            <div class="markdown-content">
                ${bodyText.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
        `;

        return div;
    }
}
