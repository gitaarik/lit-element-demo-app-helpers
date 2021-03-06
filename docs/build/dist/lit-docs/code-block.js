import { LitElement, html, css, unsafeCSS } from '../../web_modules/lit-element.js';
import hljs from '../../web_modules/highlightjs/lib/core.js';
import javascript from '../../web_modules/highlightjs/lib/languages/javascript.js';
import xml from '../../web_modules/highlightjs/lib/languages/xml.js';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
export class CodeBlock extends LitElement {
  static get properties() {
    return {
      fileName: {
        type: String
      },
      code: {
        type: String
      }
    };
  }

  firstUpdated() {
    super.firstUpdated();

    this._initHighlightJs();
  }

  _initHighlightJs() {
    this.shadowRoot.querySelectorAll('.hljs').forEach(block => {
      hljs.highlightBlock(block);
    });
  }

  render() {
    return html`
            ${this._fileName}
            <code class="hljs" ?has-filename=${!!this.fileName}>${this.code}</code>
        `;
  }

  get _fileName() {
    if (!this.fileName) {
      return;
    }

    return html`<code class="fileName">${this.fileName}</code>`;
  }

  static get styles() {
    return css`

            :host {
                display: block;
            }

            .fileName {
                display: block;
                margin: 0;
                padding: 7px 10px;
                border-radius: 5px 5px 0 0;
                font-weight: bold;
            }

            .hljs {
                display: block;
                box-sizing: border-box;
                margin: 0;
                padding: 10px;
                width: 100%;
                white-space: pre-wrap;
                border-radius: 5px;
                overflow-x: auto;
            }

            .hljs[has-filename] {
                border-radius: 0 0 5px 5px;
            }

            @media (prefers-color-scheme: light) {
                ${unsafeCSS(this.lightThemeCSS)}
            }

            @media (prefers-color-scheme: dark) {
                ${unsafeCSS(this.darkThemeCSS)}
            }

        `;
  }

  static get lightThemeCSS() {
    return css`

            .fileName {
                background: #c2beb9;
            }

			.hljs {
			  display: block;
			  overflow-x: auto;
			  padding: 0.5em;
			  color: #2f3337;
			  background: #dad7d2;
			}

			.hljs-comment {
			  color: #656e77;
			}

			.hljs-keyword,
			.hljs-selector-tag,
			.hljs-meta-keyword,
			.hljs-doctag,
			.hljs-section,
			.hljs-selector-class,
			.hljs-meta,
			.hljs-selector-pseudo,
			.hljs-attr {
			  color: #015692;
			}

			.hljs-attribute {
			  color: #803378;
			}

			.hljs-name,
			.hljs-type,
			.hljs-number,
			.hljs-selector-id,
			.hljs-quote,
			.hljs-template-tag,
			.hljs-built_in,
			.hljs-title,
			.hljs-literal {
			  color: #b75501;
			}

			.hljs-string,
			.hljs-regexp,
			.hljs-symbol,
			.hljs-variable,
			.hljs-template-variable,
			.hljs-link,
			.hljs-selector-attr,
			.hljs-meta-string {
			  color: #54790d;
			}

			.hljs-bullet,
			.hljs-code {
			  color: #535a60;
			}

			.hljs-deletion {
			  color: #c02d2e;
			}

			.hljs-addition {
			  color: #2f6f44;
			}

			.hljs-emphasis {
			  font-style: italic;
			}

			.hljs-strong {
			  font-weight: bold;
			}

        `;
  }

  static get darkThemeCSS() {
    return css`

            .fileName {
                background: #2d2d2d;
            }

            .hljs {
                color: #ffffff;
                background: #1c1b1b;
            }

            .hljs-comment {
                color: #999999;
            }

            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-meta-keyword,
            .hljs-doctag,
            .hljs-section,
            .hljs-selector-class,
            .hljs-meta,
            .hljs-selector-pseudo,
            .hljs-attr {
                color: #88aece;
            }

            .hljs-attribute {
                color: v#c59bc1;
            }

            .hljs-name,
            .hljs-type,
            .hljs-number,
            .hljs-selector-id,
            .hljs-quote,
            .hljs-template-tag,
            .hljs-built_in,
            .hljs-title,
            .hljs-literal {
                color: #f08d49;
            }

            .hljs-string,
            .hljs-regexp,
            .hljs-symbol,
            .hljs-variable,
            .hljs-template-variable,
            .hljs-link,
            .hljs-selector-attr,
            .hljs-meta-string {
                color: #b5bd68;
            }

            .hljs-bullet,
            .hljs-code {
                color: #cccccc;
            }

            .hljs-deletion {
                color: #de7176;
            }

            .hljs-addition {
                color: #76c490;
            }

            .hljs-emphasis {
                font-style: italic;
            }

            .hljs-strong {
                font-weight: bold;
            }

        `;
  }

}
customElements.define('code-block', CodeBlock);