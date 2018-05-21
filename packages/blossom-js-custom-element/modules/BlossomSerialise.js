import { contextTrap } from './proxies/ctx';

function _BlossomSerialise(element) {
  if (element === null) {
    return null;
  } else if (typeof element === 'function') {
    return element.toString();
  } else if (typeof element === 'object' && element instanceof Array) {
    return element.map(entry => _BlossomSerialise(entry));
  } else if (typeof element === 'object') {
    const result = {};
    Object.entries(element).map(entry => {
      result[entry[0]] = _BlossomSerialise(entry[1]);
      return entry;
    });
    return result;
  } else if (typeof element === 'number') return element;

  return element;
}

function BlossomSerialise(element) {
  const result = _BlossomSerialise(element);

  if (typeof result !== 'string') {
    return JSON.stringify(result);
  }

  return result.replace(/"/g, '&quote;');
}


function BlossomDeserialise(element, bindTo) {
  if (element === null) {
    return null;
  }

  if (typeof element === 'string') {
    element = element.replace(/&quote;/g, '"');
  }

  if (element === 'true') return true;
  else if (element === 'false') return false;
  else if (element.match && element.match(/^{/) && element.match(/}$/)) {
    let result;

    try {
      result = JSON.parse(element);
    } catch (e) {
      return element;
    }

    Object.entries(result).map(entry => {
      result[entry[0]] = BlossomDeserialise(entry[1], bindTo);
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

    result = result.map(entry => BlossomDeserialise(entry, bindTo));
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
      // eslint-disable-next-line no-eval
      const input = eval(tostring);
      const func = (...args) => contextTrap(bindTo, input.bind(bindTo), args);
      func.toString = () => input.toString();
      return func;
    }

    // eslint-disable-next-line no-eval
    return eval(tostring);
  } else if (typeof element === 'object' && element instanceof Array) {
    return element.map(entry => BlossomDeserialise(entry, bindTo));
  } else if (typeof element === 'object') {
    const result = {};
    Object.entries(element).map(entry => {
      result[entry[0]] = BlossomDeserialise(entry[1], bindTo);
      return entry;
    });
    return result;
  } else if (!isNaN(element)) {
    return Number(element);
  }

  return element;
}

export { BlossomSerialise, BlossomDeserialise };
