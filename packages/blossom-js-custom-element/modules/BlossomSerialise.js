function _BlossomSerialise(element) {
  if (typeof element === 'function') {
    return `__FUNCTION__${element.toString()}`;
  } else if (typeof element === 'object' && element instanceof Array) {
    return element.map(entry => _BlossomSerialise(entry));
  } else if (typeof element === 'object') {
    const result = {};
    Object.entries(element).map(entry => {
      result[entry[0]] = _BlossomSerialise(entry[1]);
      return entry;
    });
    return result;
  } else if (typeof element === 'number') return String(element);

  return element;
}

function BlossomSerialise(element) {
  const result = _BlossomSerialise(element);

  if (typeof result !== 'string') {
    return JSON.stringify(result);
  }

  return result;
}


function BlossomDeserialise(element, bindFunctionTo) {
  if (element === 'true') return true;
  else if (element === 'false') return false;
  else if (element.match && element.match(/^{/) && element.match(/}$/)) {
    try {
      const result = JSON.parse(element);
      Object.entries(result).map(entry => {
        result[entry[0]] = BlossomDeserialise(entry[1], bindFunctionTo);
        return entry;
      });
      return result;
    } catch (e) {
      return element;
    }
  } else if (element.match && element.match(/^\[/) && element.match(/\]$/)) {
    try {
      let result = JSON.parse(element);
      result = result.map(entry => BlossomDeserialise(entry, bindFunctionTo));
      return result;
    } catch (e) {
      return element;
    }
  } else if (typeof element === 'object' && element instanceof Array) {
    return element.map(entry => BlossomDeserialise(entry, bindFunctionTo));
  } else if (typeof element === 'object') {
    const result = {};
    Object.entries(element).map(entry => {
      result[entry[0]] = BlossomDeserialise(entry[1], bindFunctionTo);
      return entry;
    });
    return result;
  } else if (!isNaN(element)) {
    return Number(element);
  } else if (element.match(/^__FUNCTION__/)) {
    let tostring = element.slice(12);

    if (!tostring.match(/^\s*function/)) {
      tostring = `(function${tostring}})`;
      tostring = tostring.replace('=>', '{return ');
    } else {
      tostring = `(${tostring})`;
    }

    if (bindFunctionTo) {
      // eslint-disable-next-line no-eval
      return eval(tostring).bind(bindFunctionTo);
    }

    // eslint-disable-next-line no-eval
    return eval(tostring);
  }

  return element;
}

export { BlossomSerialise, BlossomDeserialise };
