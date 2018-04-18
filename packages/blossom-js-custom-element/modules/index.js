import { getPropProxy, patchDomAccess, setClassNamesParents, setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomCheckParentsAreLoaded } from './utils';

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

    this.props = getPropProxy(this);

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
      this.innerHTML = this.prop.children;
    }

    setClassNames(this);
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
