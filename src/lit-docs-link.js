import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsStyle } from './lit-docs-style.js';
import { litDocsUiState } from './lit-docs-ui.js';


@customElement('lit-docs-link')
class LitDocsLink extends LitDocsStyle(LitElement) {

    @property() href = '';

    render() {
        // Don't leave no spaces in the template, because the host is an inline
        // element.
        return html`<a href=${this.href}
            @click=${event => litDocsUiState.handlePageLinkClick(event)}
        ><slot></slot></a>`;
    }

    static get styles() {
        return css`
            :host {
                display: inline;
            }
        `;
    }

}