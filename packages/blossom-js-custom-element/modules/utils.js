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

const BlossomInterpolate = function BlossomInterpolate(str, from) {
  /* eslint-disable no-console, no-eval,  no-new-func */
  try {
    if (from && typeof from.nodeName !== 'undefined' && typeof from.nodeType !== 'undefined' && from.nodeType === 1) {
      BlossomConvertElement(from);
      from.resolveCtx();
    }

    const func = new Function(`return ${str}`).bind(from);
    return func();
  } catch (e) {
    if (from) {
      console.error('Tried to evaluate : ', str);
      console.error(e.message, '\n', 'STACKTRACE', from.parentElement ? getStackTrace(from) : from);
    } else {
      console.error('Tried to evaluate : ', str);
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
  HTMLEvents.forEach(event => {
    if (element.getAttribute(`l-on${event}`)) {
      element.addEventListener(event, () => {
        BlossomInterpolate(element.getAttribute(`l-on${event}`), element);
      }, false);
    }

    Array.from(element.querySelectorAll(`*[l-on${event}]`)).forEach((subElement) => {
      if (subElement.parentElement && !BlossomCheckParentsAreLoaded(subElement.parentElement)) {
        return false;
      }
      if (subElement.getAttribute(`l-on${event}`)) {
        subElement.addEventListener(event, () => {
          BlossomInterpolate(subElement.getAttribute(`l-on${event}`), subElement);
        }, false);
      }
    });
  });
};

const refreshParentChildren = function refreshParentChildren(element) {
  if (element.parentElement) {
    if (element.parentElement._updateChildren) {
      element.parentElement._updateChildren(element.parentElement.innerHTML);
    }

    refreshParentChildren(element.parentElement);
  }
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
  refreshParentChildren,
  getPropProxy,
  BlossomRegister,
  getCtxProxy,
  BlossomInterpolate,
  BlossomCheckParentsAreLoaded,
  BlossomReady,
};
