/**
 * 📝 INPUT FORM COMPONENT (v1.0)
 * Responsabilidad: Capturar materia de los aliados.
 * Axioma: Validación local antes de la resonancia remota.
 */

import { Translator } from '../../score/logic/Translator.js';
import { WorkflowDispatcher } from '../../score/logic/sovereign_workflows.js';
import { appState } from '../../score/AppState.js';

export class InputForm {
    constructor(definition) {
        this.meta = definition.meta;
        this.data = definition.data.content;
        this.logic = definition.logic;
    }

    render() {
        const form = document.createElement('form');
        form.id = this.meta.component_id;
        form.className = 'indra-form';

        form.innerHTML = `
            <h2 class="form-title">${Translator.get(this.data.form_title)}</h2>
            <div class="form-fields-container">
                ${this.data.fields.map(field => `
                    <div class="form-field">
                        <label for="${field.id}">${Translator.get(field.label)}</label>
                        ${field.type === 'textarea' 
                            ? `<textarea id="${field.id}" class="form-input" rows="4"></textarea>`
                            : `<input type="${field.type}" id="${field.id}" class="form-input" placeholder="...">`
                        }
                    </div>
                `).join('')}
            </div>
            <button type="submit" class="form-submit">
                ${Translator.get(this.data.submit_label)}
            </button>
            <div class="form-feedback"></div>
        `;

        // Reactividad: Escuchar cambios de red para deshabilitar el botón
        appState.subscribe((state) => {
            const btn = form.querySelector('.form-submit');
            if (btn) {
                btn.disabled = state.network.status === 'BUSY';
                btn.innerText = state.network.status === 'BUSY' 
                    ? '...' 
                    : Translator.get(this.data.submit_label);
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Recolección Agnóstica de Materia
            const formData = {};
            this.data.fields.forEach(field => {
                formData[field.id] = form.querySelector(`#${field.id}`).value;
            });

            // Disparar Intención de Negocio
            const workflowId = this.logic.events.on_submit;
            const feedback = form.querySelector('.form-feedback');
            
            try {
                await WorkflowDispatcher.execute(workflowId, formData);
                feedback.innerHTML = `<p class="form-message success">Resonancia Exitosa</p>`;
                form.reset();
            } catch (err) {
                feedback.innerHTML = `<p class="form-message error">Fallo en la Resonancia</p>`;
            }
        });

        return form;
    }
}
