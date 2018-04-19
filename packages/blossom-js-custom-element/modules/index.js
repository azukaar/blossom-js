import { getPropProxy, refreshParentChildren, setClassNamesParents, setEventListener, setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomCheckParentsAreLoaded } from './utils';

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

  if (elementToPatch && !elementToPatch.props) {
    elementToPatch.props = getPropProxy(elementToPatch);
  }

  if (elementToPatch && !elementToPatch.__scope) {
    elementToPatch.__scope = BlossomResolveScope(elementToPatch, true);
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
    this.__scope = {};
    this.props = getPropProxy(this);

    this._updateChildren(this.innerHTML);
    this.innerHTML = '';

    if (this.parentElement && !BlossomCheckParentsAreLoaded(this.parentElement)) return false;

    const scope = BlossomResolveScope(this);
    this.__scope = scope;


    patchDomAccess(this);

    if (this.onMount) {
      this.onMount();
    }

    this.refresh();
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

  setAliasableScope(value, defaultName) {
    const scope = {};
    if (this.getAttribute('l-alias')) {
      scope[this.getAttribute('l-alias')] = value;
    } else if (defaultName) {
      scope[defaultName] = value;
    } else {
      scope.value = value;
    }
    return this.setAttribute('l-scope', JSON.stringify(scope));
  }

  refresh() {
    addNeedRefresh(() => this.refreshTask());
  }

  refreshTask() {
    const scope = BlossomResolveScope(this);
    this.__scope = scope;

    if (this.render) {
      const result = this.render();
      if (result || result === '') {
        this.innerHTML = result;
      }
    } else {
      this.innerHTML = this.props.children;
    }

    setClassNames(this);
    setEventListener(this);
    refreshParentChildren(this);
  }

  _updateChildren(updated) {
    if (this.updateChildren) {
      this.updateChildren(updated);
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
      willNeedRefresh = JSON.stringify(this.__scope[key]) !== JSON.stringify(value);
      temp[key] = value;
      this.setAttribute('l-scope', JSON.stringify(temp));
    } else {
      willNeedRefresh = JSON.stringify(this.__scope[key]) !== JSON.stringify(value);
      this.setAttribute('l-scope', JSON.stringify({ [key]: value }));
    }

    if (willNeedRefresh) {
      this.refresh();
    }
  }
}

function BlossomSetState(element, state, value) {
  if (typeof window !== 'undefined' && !window.state) {
    window.state = {};
  }

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
};
