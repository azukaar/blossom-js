import { BlossomCheckParentsAreLoaded, getPropProxy, interpolateAttributes, contextTrap } from './utils';
import * as taskQueue from './taskQueue';
import { serialise, deserialise } from './serialise';
import { renderDiff } from './renderDiff';

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

      this.refresh();
    }
  }

  disconnectedCallback() {
    if (this.onUnmount) {
      this.onUnmount();
    }
  }

  alisableCtxString(value, defaultName) {
    const ctx = {};
    if (this.getAttribute('l-alias')) {
      ctx[this.getAttribute('l-alias')] = value;
    } else if (defaultName) {
      ctx[defaultName] = value;
    } else {
      ctx.value = value;
    }
    return `ctx='${serialise(ctx)}'`;
  }

  setAliasableCtx(defaultName, value) {
    if (this.getAttribute('l-alias')) {
      this.setCtx(this.getAttribute('l-alias'), value);
    } else {
      this.setCtx(defaultName, value);
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
      this.setAttribute('ctx', serialise(temp));
    } else {
      willNeedRefresh = true;
      this.setAttribute('ctx', serialise({ [key]: value }));
    }

    if (willNeedRefresh) {
      this.refresh();
    }
  }
}

export default Component;
