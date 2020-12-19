import { customElement, LitElement, property, html } from 'lit-element';
import { DemoPage } from '@app/helpers/index';
import '@app/helpers/index';


@customElement('demo-app-helpers-usage')
export class DemoAppHelpersUsage extends DemoPage(LitElement) {

    render() {

        return html`

            <h1>Demo App Helpers</h1>

            <p>
                The npm package <code-small>lit-state-demo-app-helpers</code-small>
                provides helper utilities to create a demo app like the one
                you're currently viewing. The package contains some web
                components, some mixins and some functions. They are documented
                in this demo app. Use the tabs at the top of the page to see
                the different helpers.
            </p>

        `;

    }

}