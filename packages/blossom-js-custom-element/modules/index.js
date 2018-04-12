import { setClassNames, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomCheckParentsAreLoaded } from './utils';

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

    this.state = new Proxy({}, {
      get: (obj, attr) => {
        if (attr === 'scope') return this.__scope;
        else if (attr === 'children') return this.getAttribute('children');
        else if (typeof attr === 'string') {
          if (this.getAttribute(`l-${attr}`)) {
            const result = BlossomInterpolate(this.getAttribute(`l-${attr}`), this.__scope, this);
            this.setAttribute(attr, JSON.stringify(result));
            return result;
          }

          if (this.getAttribute(attr)) {
            const result = this.getAttribute(attr);
            if (result === 'true') return true;
            else if (result === 'false') return false;
            else if (result.match(/^[\{\[]/) && result.match(/[\}\]]$/)) {
              try {
                return JSON.stringify(result);
              } catch (e) {
                return result;
              }
            } else if (typeof result === 'number') return Number(result);
            return result;
          }

          return '';
        }
      },
      set: (obj, attr, value) => {
        if (attr === 'scope') this.__scope = value;
        else if (typeof attr === 'string') this.setAttribute(attr, JSON.stringify(value));
        return true;
      },
    });

    if (this.onMount) {
      this.onMount();
    }

    this.refresh();
  }

  scopeString(value, defaultName) {
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

  setScope(value, defaultName) {
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

export { BlossomComponent, BlossomRegister, BlossomResolveScope, BlossomInterpolate };
