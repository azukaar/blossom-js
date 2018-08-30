import { BlossomCheckParentsAreLoaded, getPropProxy, interpolateAttributes, contextTrap, register } from './utils';
import * as taskQueue from './taskQueue';
import { serialise, deserialise } from './serialise';
import { renderDiff } from './renderDiff';
import { nativeSetAttribute } from './convertElement';

class Component extends HTMLElement {
  connectedCallback() {
    if (document.contains(this)) {
      this.ctx = {};
      this.props = getPropProxy(this);

      if (!this.props.children && this.innerHTML) {
        this.setAttribute('children', this.innerHTML);
        this.innerHTML = '';
      }

      if (this.parentElement && !BlossomCheckParentsAreLoaded(this.parentElement)) return false;

      if (this.onMount) {
        contextTrap(this, () => this.onMount());
      }

      this.isMounted = true;

      this.nativeSetAttribute = this.setAttribute;
      this.setAttribute = (name, value) => {
        if (this.getAttribute(name) !== value) {
          this.nativeSetAttribute(name, value);
          this.refresh();
        }
      };

      this.nativeRemoveAttribute = this.removeAttribute;
      this.removeAttribute = (name) => {
        if (this.getAttribute(name)) {
          this.nativeRemoveAttribute(name);
          this.refresh();
        }
      };

      this.refresh();
    }
  }

  disconnectedCallback() {
    if (this.onUnmount) {
      this.onUnmount();
    }
  }

  refresh() {
    taskQueue.add(() => this.refreshTask());
  }

  refreshTask() {
    if (document.contains(this)) {
      if (this.render) {
        const result = contextTrap(this, () => this.render());

        if (typeof result !== 'undefined') {
          const temp = document.createElement('div');
          temp.innerHTML = result;
          const changes = renderDiff(temp, this);

          changes.forEach(change => change());
        }
      }

      interpolateAttributes(this);

      if (this.onUpdate) {
        contextTrap(this, () => this.onUpdate());
      }
    }
  }

  setCtx(key, value) {
    let willNeedRefresh = false;

    if (this.getAttribute('ctx')) {
      const temp = deserialise(this.getAttribute('ctx'), this);
      willNeedRefresh = serialise(temp[key]) !== serialise(value);
      temp[key] = value;
      nativeSetAttribute(this, 'ctx', serialise(temp));
      this.ctx = temp;
    } else {
      willNeedRefresh = true;
      const temp = { [key]: value };
      nativeSetAttribute(this, 'ctx', serialise(temp));
      this.ctx = temp;
    }

    if (willNeedRefresh) {
      this.refresh();
    }
  }

  static register(name) {
    const willRegister = name || this.displayName || 'no-name';
    register({
      element: this,
      name: willRegister
    });

    return willRegister;
  }
}

export default Component;
