
function getStackTrace(element, notFirst = false) {
  let stack = '';
  let Firststack = '';
  if (!notFirst) {
    Firststack = element.outerHTML;
  }

  if (element.parentElement) { stack = getStackTrace(element.parentElement, true); }

  return stack + (Firststack ? `\n   > ${Firststack}` : `\n   > ${element.tagName}`);
}

const hashCode = function hashCode() {
  let hash = 0;
  if (this.length === 0) {
    return hash;
  }
  for (let i = 0; i < this.length; i += 1) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
};

const BlossomRegister = function BlossomRegister(settings) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && (!settings || !settings.name)) {
    throw new Error('Error: please set setting.name.');
  }

  const { element } = settings;
  // eslint-disable-next-line no-param-reassign
  delete settings.element;

  element.prototype.settings = settings;

  customElements.define(settings.name, element, {});

  return element;
};

const BlossomResolveScope = function BlossomResolveScope(element) {
  let scope = {};

  if (element.parentElement) { scope = BlossomResolveScope(element.parentElement); }
  if (element.getAttribute('l-scope')) {
    const elementScope = JSON.parse(element.getAttribute('l-scope'));

    Object.keys(elementScope).forEach(va => {
      scope[va] = elementScope[va];
    });
  }

  return scope;
};

const BlossomInterpolate = function BlossomInterpolate(str, scope, from) {
  const banedKeyWord = ['math', 'new', 'array', 'date', 'if', 'while', 'for', 'switch', 'case', 'break', 'continue', 'true', 'false'];

  // eslint-disable-next-line no-useless-escape
  const res = str.replace(/["'][\w\d \/\.\(\)\[\]\%\?\#\$\:\|\;\}\{\*\@\+\`\~\,\!\£\&\^\-\=\_\\]+["']|[\w\d\.\_\(\)\[\]]+/gmi, (match) => {
    if (!match.match(/^["']/) && !match.match(/["']$/) && match.match(/[a-zA-Z]+/) &&
          banedKeyWord.indexOf(match.split('.')[0].split('[')[0].split('(')[0].toLowerCase()) === -1) {
      return `scope.${match}`;
    }

    return match;
  });

  /* eslint-disable no-console, no-eval */
  try {
    return eval(res);
  } catch (e) {
    if (from) {
      console.error('Tried to evaluate : ', res);
      console.error(e.message, '\n', 'STACKTRACE', getStackTrace(from));
    } else {
      console.error('Tried to evaluate : ', res);
      console.error(e.message, 'but no stacktrace available, provide target element to BlossomInterpolate as a third argument to display DOM position');
    }
    return 'FAILED';
  }
  /* eslint-enable no-console */
};

const setClassNames = function setClassNames(element) {
  if (element.getAttribute('l-class')) {
    const scope = BlossomResolveScope(element);
    element.setAttribute('class', BlossomInterpolate(element.getAttribute('l-class'), scope, element));
  }

  Array.from(element.querySelectorAll('*[l-class]')).forEach((subElement) => {
    if (subElement.getAttribute('l-class')) {
      const scope = BlossomResolveScope(subElement);
      subElement.setAttribute('class', BlossomInterpolate(subElement.getAttribute('l-class'), scope, subElement));
    }
  });
};

export {
  getStackTrace,
  hashCode,
  setClassNames,
  BlossomRegister,
  BlossomResolveScope,
  BlossomInterpolate,
};
