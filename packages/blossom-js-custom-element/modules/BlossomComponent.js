import { BlossomCheckParentsAreLoaded, getPropProxy, interpolateAttributes, contextTrap } from './utils';
import { patchDomAccess } from './BlossomConvertElement';
import * as taskQueue from './taskQueue';
import { BlossomSerialise, BlossomDeserialise } from './BlossomSerialise';


class BlossomComponent extends HTMLElement {
  connectedCallback() {
    if (this.parentElement && !BlossomCheckParentsAreLoaded(this.parentElement)) return false;

    this.ctx = {};
    this.props = getPropProxy(this);

    if (!this.props.children && this.innerHTML) {
      this.setAttribute('children', this.innerHTML);
      this.innerHTML = '';
    }

    patchDomAccess(this);

    if (this.onMount) {
      contextTrap(this, () => this.onMount());
    }

    this.refresh();
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
    return `ctx='${BlossomSerialise(ctx)}'`;
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
        if (result || result === '') {
          this.innerHTML = result;
        }
      }

      interpolateAttributes(this);
    }
  }

  setCtx(key, value) {
    let willNeedRefresh = false;

    if (this.getAttribute('ctx')) {
      const temp = BlossomDeserialise(this.getAttribute('ctx'), this);
      willNeedRefresh = BlossomSerialise(temp[key]) !== BlossomSerialise(value);
      temp[key] = value;
      this.setAttribute('ctx', BlossomSerialise(temp));
    } else {
      willNeedRefresh = BlossomSerialise(this.ctx[key]) !== BlossomSerialise(value);
      this.setAttribute('ctx', BlossomSerialise({ [key]: value }));
    }

    if (willNeedRefresh) {
      this.refresh();
    }
  }
}

export default BlossomComponent;
