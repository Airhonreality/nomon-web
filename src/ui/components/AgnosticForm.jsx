/**
 * 📝 AGNOSTIC FORM BUILDER (v1.0 OMEGA)
 * Responsabilidad: Generar interfaces de captura de datos basadas en Schemas.
 * Axioma: El formulario no se programa, se "infiere" del ADN.
 */

import { WorkflowDispatcher } from '../../score/logic/sovereign_workflows.js';
import { EntitySchema as EntrySchema } from '../../score/schemas/EntitySchema.js';

export class AgnosticForm {
    constructor(definition) {
        this.meta = definition.meta;
        this.data = definition.data.content;
        
        // El esquema puede venir en la data o usamos el EntrySchema por defecto
        this.schema = this.data.schema || EntrySchema;
        this.workflowId = this.meta.logic?.events?.on_submit || 'WORKFLOW_ENTRY_CREATE';
    }

    render() {
        const form = document.createElement('form');
        form.className = 'agnostic-form glass-morph';
        
        // Generar campos basados en las llaves del Schema
        Object.keys(this.schema).forEach(key => {
            if (key === 'id' || key === 'metadata' || key === 'created_at') return;

            const fieldConfig = this.schema[key];
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'form-field';

            const label = document.createElement('label');
            label.innerText = key.toUpperCase().replace('_', ' ');
            fieldWrapper.appendChild(label);

            let input;

            // Lógica de Inferencia de Input
            if (key === 'type' && this.schema.type_options) {
                input = document.createElement('select');
                this.schema.type_options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.id;
                    o.innerText = opt.label;
                    input.appendChild(o);
                });
            } else if (key === 'body_markdown') {
                input = document.createElement('textarea');
                input.placeholder = "Escribe aquí el contenido en Markdown...";
                input.rows = 10;
            } else {
                input = document.createElement('input');
                input.type = fieldConfig === 'NUMBER' ? 'number' : 'text';
                input.placeholder = `Ingresa ${key}...`;
            }

            input.name = key;
            fieldWrapper.appendChild(input);
            form.appendChild(fieldWrapper);
        });

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'indra-button-primary';
        submitBtn.innerText = '🚀 Emitir Materia al Core';
        form.appendChild(submitBtn);

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            console.log(`[form] 🚀 Disparando workflow: ${this.workflowId}`);
            await WorkflowDispatcher.execute(this.workflowId, data);
        };

        return form;
    }
}
