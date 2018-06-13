import { contextTrap } from './proxies/ctx';
import { BlossomProxyElement } from './convertElement';

function subSerialise(element) {
  if (element === null) {
    return null;
  } else if (typeof element === 'boolean') {
    return element;
  } else if (typeof element === 'function') {
    return element.toString();
  } else if (typeof element === 'object' && element instanceof Array) {
    return element.map(entry => subSerialise(entry));
  } else if (typeof element === 'object') {
    const result = {};
    Object.entries(element).map((entry) => {
      result[entry[0]] = subSerialise(entry[1]);
      return entry;
    });
    return result;
  } else if (typeof element === 'number') return element;

  return element;
}

function serialise(element) {
  const result = subSerialise(element);

  if (typeof result !== 'string') {
    return JSON.stringify(result);
  }

  return result.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


function deserialise(unescapedElement, bindTo) {
  let element = unescapedElement;

  if (element === null) {
    return null;
  }

  if (typeof element === 'string') {
    element = element.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
  }

  if (element === 'true') return true;
  else if (element === 'false') return false;
  else if (typeof element === 'boolean') return element;
  else if (element.match && element.match(/^{/) && element.match(/}$/)) {
    let result;

    try {
      result = JSON.parse(element);
    } catch (e) {
      return element;
    }

    Object.entries(result).map((entry) => {
      result[entry[0]] = deserialise(entry[1], bindTo);
      return entry;
    });
    return result;
  } else if (element.match && element.match(/^\[/) && element.match(/\]$/)) {
    let result;

    try {
      result = JSON.parse(element);
    } catch (e) {
      return element;
    }

    result = result.map(entry => deserialise(entry, bindTo));
    return result;
  } else if (element.match && (element.match(/^\s*function\s*\(/) || (element.match(/^\(/) && element.match(/=>/)))) {
    let tostring = element.slice();

    if (!tostring.match(/^\s*function/)) {
      tostring = `(function${tostring}`;
      if (tostring.match(/=>\s+{/)) {
        tostring = tostring.replace(/=>\s+{/, '{');
        tostring += ')';
      } else {
        tostring = tostring.replace('=>', '{return ');
        tostring += '})';
      }
    } else {
      tostring = `(${tostring})`;
    }

    if (bindTo) {
      const input = eval(tostring);
      const func = (...args) => contextTrap(bindTo, input.bind(BlossomProxyElement(bindTo)), args);
      func.toString = () => input.toString();
      return func;
    }

    return eval(tostring);
  } else if (typeof element === 'object' && element instanceof Array) {
    return element.map(entry => deserialise(entry, bindTo));
  } else if (typeof element === 'object') {
    const result = {};
    Object.entries(element).map((entry) => {
      result[entry[0]] = deserialise(entry[1], bindTo);
      return entry;
    });
    return result;
  } else if (element === '') {
    return '';
    // eslint-disable-next-line no-restricted-globals
  } else if (!isNaN(element)) {
    return Number(element);
  }

  return element;
}

export { serialise, deserialise };
