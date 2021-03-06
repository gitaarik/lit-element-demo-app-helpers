import { css, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { render } from 'lit-html';
import { litStyle } from 'lit-element-style';
import { litDocsUiState } from './lit-docs-ui';


// Global container of all the anchors on the page. This is global so that the
// `goToAnchor()` function can be used from any component.
let ANCHORS = [];

function scrollCorrection() {
    if (window.innerWidth > 600) {
        return 10;
    } else {
        return 50;
    }
}

function scrollToAnchorExec(anchorData) {
    const newScrollY = window.scrollY + anchorData.element.getBoundingClientRect().top - scrollCorrection();
    window.scrollTo(0, newScrollY);
}

function getAnchorData(anchorName, returnList = false) {

    const conditionFunc = anchor => {
        return anchor.anchorName == anchorName;
    };

    if (returnList) {
        return ANCHORS.filter(conditionFunc);
    } else {
        return ANCHORS.find(conditionFunc);
    }

}

function scrollToAnchor(anchorName) {
    const anchorData = getAnchorData(anchorName);
    if (!anchorData) return;
    scrollToAnchorExec(anchorData);
}

export function goToAnchor(anchorName) {

    if (!anchorName) return;

    // `setTimeout` is used to queue the task at the end of the execution
    // stack, so that any page change rendering has finished.
    window.setTimeout(() => scrollToAnchor(anchorName));

    // Execute `scrollToAnchor()` again when the page has fully loaded. Because
    // when other components load, it could change the scroll offset.
    window.addEventListener('load', event => {
        scrollToAnchor(anchorName);
    });

}


const litDocsAnchorsStyles = litStyle(css`

    h1 .headingAnchor:not([active]),
    h2 .headingAnchor:not([active]),
    h3 .headingAnchor:not([active]),
    h4 .headingAnchor:not([active]),
    h5 .headingAnchor:not([active]),
    h6 .headingAnchor:not([active]) {
        display: none;
    }

    h1:hover .headingAnchor,
    h2:hover .headingAnchor,
    h3:hover .headingAnchor,
    h4:hover .headingAnchor,
    h5:hover .headingAnchor,
    h6:hover .headingAnchor {
        display: inline-block;
    }

    .headingAnchor {
        display: inline-block;
        fill: rgb(115, 121, 126);
        text-decoration: none;
        height: 15px;
    }

    .headingAnchor svg {
        height: 100%;
    }

`);


export const LitDocsAnchors = superclass => class extends litDocsAnchorsStyles(superclass) {

    connectedCallback() {
        super.connectedCallback();
        this._addHashChangeListener();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeHashChangeListener();
        this._removeAnchors();
    }

    firstUpdated() {
        super.firstUpdated();
        this._addAnchors();
        this._renderAnchors();
        this._loadInitialAnchor();
    }

    _addHashChangeListener() {
        this.hashChangeCallback = event => {
            this.loadAnchorFromUrl(event.newURL);
        };
        window.addEventListener('hashchange', this.hashChangeCallback);
    }

    _removeHashChangeListener() {
        window.removeEventListener('hashchange', this.hashChangeCallback);
    }

    _loadInitialAnchor() {
        this.loadAnchorFromUrl(window.location.href);
    }

    loadAnchorFromUrl(url) {

        if (litDocsUiState.useHash && url.split('#').length < 3) {
            return;
        }

        goToAnchor(url.split('#').slice(-1)[0]);

    }

    _addAnchors() {

        this._addedAnchors = [];
        const tagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        for (const tagName of tagNames) {

            const elements = this.shadowRoot.querySelectorAll(tagName);

            for (const element of elements) {
                this._addAnchor(element);
            }

        }

    }

    _removeAnchors() {
        for (let addedAnchor of this._addedAnchors) {
            const anchorIndex = ANCHORS.findIndex(anchor => {
                return anchor.anchorName === addedAnchor.anchorName;
            });
            ANCHORS.splice(anchorIndex, 1);
        }
    }

    _addAnchor(element) {

        const anchorData = {
            anchorName: this._getAnchorName(element),
            element
        };

        ANCHORS.push(anchorData);

        this._addedAnchors.push(anchorData);

    }

    _renderAnchors() {
        for (let anchor of this._addedAnchors) {
            this._renderAnchor(anchor);
        }
    }

    _renderAnchor(anchor) {

        const active = window.location.hash.substr(1) === anchor.anchorName;

        const template = html`
            <span>${unsafeHTML(anchor.element.innerHTML)}</span>
            <a
                class="headingAnchor"
                href=${window.location.pathname + this._baseHash + '#' + anchor.anchorName}
                ?active=${active}
                @click=${() => goToAnchor(anchor.anchorName)}
            >
                ${this._anchorSvg}
            </a>
        `;

        render(template, anchor.element);
        anchor.element.id = anchor.anchorName;

    }

    get _baseHash() {

        if (!litDocsUiState.useHash || window.location.hash[0] !== '#') {
            return '';
        }

        const hashValue = window.location.hash.substr(1);
        const hashes = hashValue.split('#');

        if (hashes.length > 1) {
            return '#' + hashes.slice(0, -1).join('#');
        } else {
            return '#' + hashes[0];
        }

    }

    _getAnchorName(element) {

        const baseAnchorName = element.textContent.replace(/ /g, '-').replace(/[^\w-_\.]/gi, '').toLowerCase();
        let anchorName = baseAnchorName;
        let alreadyExistingAnchor = getAnchorData(anchorName);
        let counter = 1;

        while (alreadyExistingAnchor) {
            counter++;
            anchorName = baseAnchorName + '-' + counter;
            alreadyExistingAnchor = getAnchorData(anchorName);
        }

        return anchorName;

    }

    get _anchorSvg() {

        return html`
            <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path>
            </svg>
        `;

    }

}
