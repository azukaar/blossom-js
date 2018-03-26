
function getStackTrace(element, notFirst = false) {
  let stack = '';
  let Firststack = '';
  if(!notFirst) {
    Firststack = element.outerHTML;
  }

  if(element.parentElement)
    stack = getStackTrace(element.parentElement, true);

  return stack + (Firststack ?  '\n   > ' + Firststack : '\n   > ' + element.tagName);
}

const hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

setClassNames = function (element) {
    if(element.getAttribute('l-class')) {
        element.setAttribute('class', BlossomInterpolate(element.getAttribute('l-class')));
    }
    
    Array.from(element.querySelectorAll('*[l-class]')).forEach((subElement) => {
        if(subElement.getAttribute('l-class'))
            subElement.setAttribute('class', BlossomInterpolate(subElement.getAttribute('l-class'))) 
    });
}

BlossomRegister =  function (settings) {
    if(typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && (!settings || !settings.name)) {
        throw new Error('Error: please set setting.name.');
    }

    const element = settings.element;
    delete settings.element;

    element.prototype.settings = settings;

    customElements.define(settings.name, element, {});

    return element;
}

BlossomResolveScope = function(element) {
    let scope = {};

    if(element.parentElement)
      scope = BlossomResolveScope(element.parentElement);
    if(element.getAttribute('l-scope')) {
      const elementScope = JSON.parse(element.getAttribute('l-scope'));
      for(va in elementScope) {
        scope[va] = elementScope[va];
      }
    }

    return scope;
}

BlossomInterpolate = function(str, scope, from) {
  const banedKeyWord = ['math', 'new', 'array', 'date', 'if', 'while', 'for', 'switch', 'case', 'break', 'continue', 'true', 'false'];

  const res = str.replace(/["'][\w\d \.\(\)\[\]]+["']|[\w\d\.\(\)\[\]]+/gmi, (match) => {
      if(!match.match(/^["']/) && !match.match(/["']$/) && match.match(/[a-zA-Z]+/) &&
          banedKeyWord.indexOf(match.split('.')[0].split('[')[0].split('(')[0].toLowerCase()) === -1) {
        return "scope."+match;
      }
      else {
        return match;
      }
  });

  try {
    return eval(res);
  } catch(e) {
    if(from) {
      console.error('Tried to evaluate : ', res);
      console.error(e.message, '\n', 'STACKTRACE', getStackTrace(from));
    }
    else {
      console.error('Tried to evaluate : ', res);
      console.error(e.message, 'but no stacktrace available, provide target element to BlossomInterpolate as a third argument to display DOM position');
    }
    return 'FAILED';
  }
}

module.exports = {getStackTrace, hashCode, setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate};