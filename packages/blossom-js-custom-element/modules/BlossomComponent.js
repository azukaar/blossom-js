import { BlossomCheckParentsAreLoaded, getPropProxy, refreshParentChildren, setEventListener, setClassNames, getCtxProxy } from './utils';
import { patchDomAccess } from './BlossomConvertElement';
import * as taskQueue from './taskQueue';

class BlossomComponent extends HTMLElement {
  connectedCallback() {
    this.ctx = {};
    this.props = getPropProxy(this);

    if (this.parentElement && !BlossomCheckParentsAreLoaded(this.parentElement)) return false;

    this._updateChildren(this.innerHTML);
    this.innerHTML = '';


    const ctx = getCtxProxy(this);
    this.ctx = ctx;


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

  resolveCtx() {
    this.ctx = getCtxProxy(this);
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
    return `l-ctx='${JSON.stringify(ctx)}'`;
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
      const ctx = getCtxProxy(this);
      this.ctx = ctx;

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
      // eslint-disable-next-line no-extend-native
      String.prototype.unwrap = function unwrap(query) {
        const temp = document.createElement('div');
        temp.innerHTML = this.toString();
        if (temp.querySelector(query)) {
          return temp.querySelector(query).innerHTML;
        }

        return updated;
      };

      // eslint-disable-next-line no-extend-native
      String.prototype.strip = function strip(query) {
        const temp = document.createElement('div');
        temp.innerHTML = this.toString();
        if (temp.querySelector(query)) {
          return temp.removeChild(temp.querySelector(query));
        }

        return updated;
      };

      this.updateChildren(updated);

      delete String.prototype.unwrap;
      delete String.prototype.strip;
    } else {
      this.setAttribute('children', this.innerHTML);
    }
  }

  setCtx(key, value) {
    let realValue = value;

    if (key === '___RESULT') {
      return true;
    }
    if (typeof realValue === 'function') {
      realValue = `__FUNCTION__${realValue.toString()}`;
    }
    let willNeedRefresh = false;
    if (this.getAttribute('l-ctx')) {
      const temp = JSON.parse(this.getAttribute('l-ctx'));
      willNeedRefresh = JSON.stringify(this.ctx[key]) !== JSON.stringify(realValue);
      temp[key] = realValue;
      this.setAttribute('l-ctx', JSON.stringify(temp));
    } else {
      willNeedRefresh = JSON.stringify(this.ctx[key]) !== JSON.stringify(realValue);
      this.setAttribute('l-ctx', JSON.stringify({ [key]: realValue }));
    }

    if (willNeedRefresh) {
      this.refresh();
    }
  }
}

export default BlossomComponent;
