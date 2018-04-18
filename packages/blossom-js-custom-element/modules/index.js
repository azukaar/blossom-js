import { getPropProxy, refreshParentChildren, patchDomAccess, setClassNamesParents, setEventListener, setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomCheckParentsAreLoaded } from './utils';

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
  BlossomRegister,
  BlossomResolveScope,
  BlossomInterpolate,
};
