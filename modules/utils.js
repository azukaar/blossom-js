import { nativeSetAttribute } from './convertElement';
import getPropProxy from './proxies/props';
import { setCtx, getCtx, contextTrap } from './proxies/ctx';
import { deserialise, serialise } from './serialise';

// document.createEvent('update');

let BlossomDocumentReady;

let resolveBlossomReady;
const BlossomReady = new Promise((resolve) => {
  resolveBlossomReady = resolve;
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

const register = function register(settings) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && (!settings || !settings.name)) {
    throw new Error('Error: please set setting.name.');
  }

  unloaded[settings.name] = true;

  BlossomDocumentReady.then(() => {
    const { element } = settings;
    delete settings.element;
    element.prototype.settings = settings;
    unloaded[settings.name] = false;
    customElements.define(settings.name, element, {});

    if (Object.values(unloaded).filter(e => e).length === 0) resolveBlossomReady();

    return element;
  });
};

const interpolate = function interpolate(input, from) {
  /* eslint-disable no-console */
  try {
    if (from && typeof from.nodeName !== 'undefined' && typeof from.nodeType !== 'undefined' && from.nodeType === 1) {
      from.ctx = getCtx(from);
    }

    if (typeof input === 'string') {
      const func = new Function(`return ${input}`).bind(from);
      const result = func();

      return result;
    }

    return input;
  } catch (e) {
    if (from) {
      console.error('Tried to evaluate : ', input);
      console.error(e.message, '\n', 'STACKTRACE', from.parentElement ? getStackTrace(from) : from);
    } else {
      console.error('Tried to evaluate : ', input);
      console.error(e.message, 'but no stacktrace available, provide target element to interpolate as a third argument to display DOM position');
    }
    return undefined;
  }
  /* eslint-enable no-console */
};

const interpolateAttributes = function setClassNames(element) {
  const it = document.evaluate('.//*[@*[starts-with(name(), "l-")]]', element, null, window.XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  const currents = [element];

  let next = it.iterateNext();
  while (next) {
    currents.push(next);
    next = it.iterateNext();
  }

  const interpolateAtribute = (current, att) => {
    const { name, value } = att;
    const processing = current;

    if (name.match(/^l-on/)) {
      const event = name.slice(4);
      if (!current.eventCollection) current.eventCollection = [];
      if (current.eventCollection.indexOf(event) === -1) {
        const func = deserialise(value, processing);
        current.addEventListener(event, (eventValue) => {
          contextTrap(processing, () => func(eventValue));
        }, false);
        current.eventCollection.push(event);
      }
    } else if (name.match(/^l-/)) {
      const realName = name.slice(2);
      const result = serialise(interpolate(value, current));
      if (current.tagName === 'INPUT' && realName === 'checked' && result === 'false') {
        current.removeAttribute(realName);
      } else {
        nativeSetAttribute(current, realName, result);
      }
    }
  };

  currents.forEach((current) => {
    if (!current.parentElement || BlossomCheckParentsAreLoaded(current.parentElement)) {
      current.ctx = getCtx(current);
      Array.from(current.attributes).forEach(att => interpolateAtribute(current, att));
    }
  });
};

if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-underscore-dangle
  BlossomDocumentReady = window.__SERVERSIDE ? Promise.resolve() : new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => {
      resolve();
      interpolateAttributes(document.querySelector('*'));
    });
  });
}

export {
  getStackTrace,
  interpolateAttributes,
  getPropProxy,
  register,
  setCtx,
  getCtx,
  contextTrap,
  interpolate,
  BlossomCheckParentsAreLoaded,
  BlossomReady,
};
