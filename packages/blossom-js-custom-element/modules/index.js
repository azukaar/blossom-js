import { getStateProxy, patchDomAccess, setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomCheckParentsAreLoaded } from './utils';

class BlossomComponent extends HTMLElement {
  attributeChangedCallback() {
    this.refresh();
  }

  connectedCallback() {
    this.setAttribute('children', this.innerHTML);
    this.innerHTML = '';

    if (this.parentElement && !BlossomCheckParentsAreLoaded(this.parentElement)) return false;

    const scope = BlossomResolveScope(this);
    this.__scope = scope;

    this.state = getStateProxy(this);

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
    const scope = BlossomResolveScope(this);
    this.__scope = scope;

    if (this.render) {
      const result = this.render();
      if (result || result === '') {
        this.innerHTML = result;
      }
    } else {
      this.innerHTML = this.state.children;
    }

    setClassNames(this);
  }
}

function BlossomRefreshState() {
  setClassNames(document.body);
}

export {
  BlossomRefreshState,
  BlossomComponent,
  BlossomRegister,
  BlossomResolveScope,
  BlossomInterpolate,
};
