import { BlossomConvertElement } from './BlossomConvertElement';
import HTMLEvents from './../assets/htmlevents.json';
import getPropProxy from './proxies/props';
import getCtxProxy from './proxies/ctx';

let BlossomDocumentReady;

let _BlossomReady;
const BlossomReady = new Promise((resolve) => {
  _BlossomReady = resolve;
});

const unloaded = {};

function getStackTrace(element, notFirst = false) {
  let stack = '';
  let Firststack = '';
  if (!notFirst) {
    Firststack = element.outerHTML;
  }

  if (element.parentElement) { stack = getStackTrace(element.parentElement, true); }

  return stack + (Firststack ? `\n   > ${Firststack}` : `\n   > ${element.tagName}`);
}

const BlossomCheckParentsAreLoaded = function BlossomCheckParentsAreLoaded(element) {
  if (unloaded[element.tagName.toLowerCase()]) return false;

  if (element.parentElement) return BlossomCheckParentsAreLoaded(element.parentElement);

  return true;
};

const BlossomRegister = function BlossomRegister(settings) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && (!settings || !settings.name)) {
    throw new Error('Error: please set setting.name.');
  }

  unloaded[settings.name] = true;

  BlossomDocumentReady.then(() => {
    const { element } = settings;
    // eslint-disable-next-line no-param-reassign
    delete settings.element;
    element.prototype.settings = settings;
    unloaded[settings.name] = false;
    customElements.define(settings.name, element, {});

    if (Object.values(unloaded).filter(e => e).length === 0) _BlossomReady();

    return element;
  });
};

const BlossomInterpolate = function BlossomInterpolate(input, from) {
  /* eslint-disable no-console, no-eval,  no-new-func */
  try {
    if (from && typeof from.nodeName !== 'undefined' && typeof from.nodeType !== 'undefined' && from.nodeType === 1) {
      BlossomConvertElement(from);
      from.resolveCtx();
    }

    if (typeof input === 'string') {
      const func = new Function(`return ${input}`).bind(from);

      return func();
    }

    return input;
  } catch (e) {
    if (from) {
      console.error('Tried to evaluate : ', input);
      console.error(e.message, '\n', 'STACKTRACE', from.parentElement ? getStackTrace(from) : from);
    } else {
      console.error('Tried to evaluate : ', input);
      console.error(e.message, 'but no stacktrace available, provide target element to BlossomInterpolate as a third argument to display DOM position');
    }
    return undefined;
  }
  /* eslint-enable no-console, no-eval,  no-new-func */
};

const setClassNames = function setClassNames(element) {
  if (element.getAttribute('l-class')) {
    element.setAttribute('class', BlossomInterpolate(element.getAttribute('l-class'), element));
  }

  Array.from(element.querySelectorAll('*[l-class]')).forEach((subElement) => {
    if (subElement.parentElement && !BlossomCheckParentsAreLoaded(subElement.parentElement)) {
      return false;
    }
    if (subElement.getAttribute('l-class')) {
      subElement.setAttribute('class', BlossomInterpolate(subElement.getAttribute('l-class'), subElement));
    }
  });
};

const setEventListener = function setEventListener(element) {
  if (!element.eventCollection) {
    // eslint-disable-next-line no-param-reassign
    element.eventCollection = [];
  }

  HTMLEvents.forEach(event => {
    if (element.getAttribute(`l-on${event}`) && element.eventCollection.indexOf(event) === -1) {
      element.addEventListener(event, (eventValue) => {
        BlossomConvertElement(element).props[`on${event}`](eventValue);
      }, false);
      BlossomConvertElement(element).eventCollection.push(event);
    }

    Array.from(element.querySelectorAll(`*[l-on${event}]`)).forEach((subElement) => {
      if (!subElement.eventCollection) {
        // eslint-disable-next-line no-param-reassign
        subElement.eventCollection = [];
      }

      if (subElement.parentElement && !BlossomCheckParentsAreLoaded(subElement.parentElement)) {
        return false;
      }
      if (subElement.getAttribute(`l-on${event}`) && subElement.eventCollection.indexOf(event) === -1) {
        subElement.addEventListener(event, (eventValue) => {
          BlossomConvertElement(subElement).props[`on${event}`](eventValue);
        }, false);
        subElement.eventCollection.push(event);
      }
    });
  });
};

if (typeof window !== 'undefined') {
  BlossomDocumentReady = window.__SERVERSIDE ? Promise.resolve() : new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => {
      resolve();

      setClassNames(document.querySelector('*'));
      setEventListener(document.querySelector('*'));
      BlossomConvertElement(document.querySelector('*'));

      if (document.body) {
        BlossomConvertElement(document.body);
      }
    });
  });
}

export {
  getStackTrace,
  setClassNames,
  setEventListener,
  getPropProxy,
  BlossomRegister,
  getCtxProxy,
  BlossomInterpolate,
  BlossomCheckParentsAreLoaded,
  BlossomReady,
};
