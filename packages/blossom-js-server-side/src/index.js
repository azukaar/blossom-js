/* eslint-disable */

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><body></body></html>`);
global.window = dom.window;
global.document = window.document;
global.HTMLElement = class {
    constructor() {
    }

    __servermock() {}
};

document._registerElementCache = {};
global.customElements = {
    define(name, element, setting) {
        document._registerElementCache[name] = element;
    }
};

function manualExtends(obj) {
    var props = {};
    do {
        if(Object.getOwnPropertyNames(obj)[1] === '__servermock') break;
        Object.getOwnPropertyNames(obj).map((name) => {
            props[name] = obj[name];
        })
    } while (obj = Object.getPrototypeOf(obj));
    return props;
}

document._createElement = document.createElement;

document.createElement = (element) => {
    if(document._registerElementCache[element]) {
        const o = document._createElement(element);
        Object.assign(o, manualExtends(new document._registerElementCache[element]()));
        return o;
    }
    else {
        let domElement = document._createElement(element);
        return domElement;
    }
}

// TODO re-render if new refresh occured 
// return number of draw digest for tests

global.BlossomRender = function BlossomRender(template) {
    const domNodes = document.createElement('div');
    domNodes.setAttribute('SSR_IGNORE_THIS', true);
    const originalContains = document.contains;
    document.contains = (element) => {
        return domNodes.contains(element);
    }

    domNodes.innerHTML = template;

    Array.from(domNodes.children).forEach((child) => {
        Object.defineProperty(child, 'parentElement', {
            get: () => undefined,
        });
    })

    function brelement(domNodes) {
        for(let i = 0; i < domNodes.children.length; i++) {
            const element = domNodes.children[i];
            if(document._registerElementCache[element.tagName.toLowerCase()]) {
                let newElement = document.createElement(element.tagName.toLowerCase());

                Array.from(element.attributes).map((attr) => {
                    if (newElement.nativeSetAttribute) {
                        newElement.nativeSetAttribute(attr.name, element.getAttribute(attr.name))
                    } else {
                        newElement.setAttribute(attr.name, element.getAttribute(attr.name))
                    }
                });

                newElement.innerHTML = element.innerHTML;
                domNodes.replaceChild(newElement, element);

                if (domNodes.getAttribute('SSR_IGNORE_THIS')) {
                    Object.defineProperty(newElement, 'parentElement', {
                        get: () => undefined,
                    });
                }

                newElement.connectedCallback();

                brelement(newElement);
            }
            else {
                brelement(element);
            }
        }

        return domNodes;
    }

    const result = brelement(domNodes)
    document.contains = originalContains;
    return result;
}

window.__SERVERSIDE = true;