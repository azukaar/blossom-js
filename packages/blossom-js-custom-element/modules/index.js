import {getStackTrace, hashCode, setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate} from './utils';

class BlossomComponent extends HTMLElement {
    constructor() {
        super();
    }

    attributeChangedCallback() {
    	this.refresh()
    }
    
    connectedCallback() {
        this.setAttribute('children', this.innerHTML);
        const scope = BlossomResolveScope(this);
        this.innerHTML = '';
        this.__scope = scope;

        this.state = new Proxy({},  {
            get: (obj, attr) => {
                if(attr === 'scope') return this.__scope;
                else if(attr === 'children') return this.getAttribute('children');
                else if (typeof attr === 'string') {
                    if(this.getAttribute(attr)) {
                        return BlossomInterpolate(this.getAttribute(attr), this.__scope, this);
                    }
                    else {
                        return '';
                    }
                }
            },
            set: (obj, attr, value) => {
                if(attr === 'scope') this.__scope = value;
                else if (typeof attr === 'string') this.setAttribute(attr, JSON.stringify(value));
                return true;
            }
        });

        if(this.onMount) {
            this.onMount();
        }

        this.refresh();
    }

    scopeString(value, defaultName) {
        let scope = {};
        if(this.getAttribute('l-alias')) {
            scope[this.getAttribute('l-alias')] = value;
        }
        else if(defaultName) {
            scope[defaultName] = value;
        }
        else {
            scope['value'] = value;
        }
        return `l-scope='${JSON.stringify(scope)}'`;
    }

    setScope(value, defaultName) {
        let scope = {};
        if(this.getAttribute('l-alias')) {
            scope[this.getAttribute('l-alias')] = value;
        }
        else if(defaultName) {
            scope[defaultName] = value;
        }
        else {
            scope['value'] = value;
        }
        return this.setAttribute('l-scope', JSON.stringify(scope));
    }

    refresh() {
        const scope = BlossomResolveScope(this);
        this.__scope = scope;

        if(this.render) {
            const result = this.render();
            if(result || result === '') {
                this.innerHTML = result;
            }
        }
        else {
            this.innerHTML = this.state.children;
        }

        setClassNames(this);
    }
}

export {BlossomComponent, BlossomRegister, BlossomResolveScope, BlossomInterpolate};