import { BlossomReady, getPropProxy, refreshParentChildren, setClassNamesParents, setEventListener, setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomCheckParentsAreLoaded } from './utils';

const needRefresh = [];

function needRefreshRunNext() {
  needRefresh[0]();
  needRefresh.shift();
  if (needRefresh.length > 0) {
    needRefreshRunNext();
  }
}

function addNeedRefresh(task) {
  const needStart = needRefresh.length === 0;
  needRefresh.push(task);
  if (needStart) {
    needRefreshRunNext();
  }
}


function BlossomConvertElement(elementToPatch) {
  if (elementToPatch && !elementToPatch.setScope) {
    elementToPatch.setScope = BlossomComponent.prototype.setScope;
  }

  if (elementToPatch && !elementToPatch.scope) {
    elementToPatch.scope = BlossomResolveScope(elementToPatch, true);
  }

  if (elementToPatch && !elementToPatch.props) {
    elementToPatch.props = getPropProxy(elementToPatch);
  }

  if (elementToPatch && !elementToPatch.resolveScope) {
    elementToPatch.resolveScope = () => {
      elementToPatch.scope = BlossomResolveScope(elementToPatch, true);
    }
  }

  if (elementToPatch && !elementToPatch.refresh) {
    elementToPatch.refresh = () => {
      elementToPatch.innerHTML = elementToPatch.innerHTML;
      setClassNames(elementToPatch);
      setEventListener(elementToPatch);
      refreshParentChildren(elementToPatch);
    };
  }

  return elementToPatch;
}

function patchDomAccess(element) {
  element.nativeParentElement = element.parentElement;

  Object.defineProperty(element, 'parentElement', {
    get: () => BlossomConvertElement(element.nativeParentElement),
  });
}


class BlossomComponent extends HTMLElement {
  connectedCallback() {
    this.scope = {};
    this.props = getPropProxy(this);

    if (this.parentElement && !BlossomCheckParentsAreLoaded(this.parentElement)) return false;

    this._updateChildren(this.innerHTML);
    this.innerHTML = '';


    const scope = BlossomResolveScope(this);
    this.scope = scope;


    patchDomAccess(this);

    if (this.onMount) {
      this.onMount();
    }

    this.refresh();
  }

  disconnectedCallback() {
    if (this.onUnmount) {
      this.onUnmount();
    }
  }

  resolveScope() {
    this.scope = BlossomResolveScope(this);
  }

  alisableScopeString(value, defaultName) {
    const scope = {};
    if (this.getAttribute('l-alias')) {
      scope[this.getAttribute('l-alias')] = value;
    } else if (defaultName) {
      scope[defaultName] = value;
    } else {
      scope.value = value;
    }
    return `l-scope='${JSON.stringify(scope)}'`;
  }

  setAliasableScope(defaultName, value) {
    if (this.getAttribute('l-alias')) {
      this.setScope(this.getAttribute('l-alias'), value);
    } else {
      this.setScope(defaultName, value);
    }
  }

  refresh() {
    addNeedRefresh(() => this.refreshTask());
  }

  refreshTask() {
    if (document.contains(this)) {
      const scope = BlossomResolveScope(this);
      this.scope = scope;

      if (this.render) {
        const result = this.render();
        if (result || result === '') {
          this.innerHTML = result;
        }
      }

      setClassNames(this);
      setEventListener(this);
      refreshParentChildren(this);
    }
  }

  _updateChildren(updated) {
    if (this.updateChildren) {
      const str = updated;

      str.__proto__.unwrap = function unwrap(query) {
        const temp = document.createElement('div');
        temp.innerHTML = this.toString();
        if (temp.querySelector(query)) {
          return temp.querySelector(query).innerHTML;
        } else {
          return updated;
        }
      };

      str.__proto__.strip = function strip() {
        const temp = document.createElement('div');
        temp.innerHTML = this.toString();
        if (temp.querySelector(query)) {
          return temp.removeChild(temp.querySelector(query));
        } else {
          return updated;
        }
      };

      this.updateChildren(updated);

      delete str.__proto__.unwrap;
      delete str.__proto__.strip;
    } else {
      this.setAttribute('children', this.innerHTML);
    }
  }

  setScope(key, value) {
    if (key === '___RESULT') {
      return true;
    }
    if (typeof value === 'function') {
      value = `__FUNCTION__${value.toString()}`;
    }
    let willNeedRefresh = false;
    if (this.getAttribute('l-scope')) {
      const temp = JSON.parse(this.getAttribute('l-scope'));
      willNeedRefresh = JSON.stringify(this.scope[key]) !== JSON.stringify(value);
      temp[key] = value;
      this.setAttribute('l-scope', JSON.stringify(temp));
    } else {
      willNeedRefresh = JSON.stringify(this.scope[key]) !== JSON.stringify(value);
      this.setAttribute('l-scope', JSON.stringify({ [key]: value }));
    }

    if (willNeedRefresh) {
      this.refresh();
    }
  }
}

if (typeof window !== 'undefined' && !window.state) {
  window.state = {};
}

function BlossomSetState(state, value, element) {
  window.state[state] = value;

  setClassNamesParents(element);
}

export {
  BlossomSetState,
  BlossomComponent,
  BlossomConvertElement,
  BlossomRegister,
  BlossomResolveScope,
  BlossomInterpolate,
  BlossomReady,
};
