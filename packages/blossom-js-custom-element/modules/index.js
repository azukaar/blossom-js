import { BlossomReady, getPropProxy, refreshParentChildren, setClassNamesParents, setEventListener, setClassNames, BlossomRegister, BlossomResolveCtx, BlossomInterpolate, BlossomCheckParentsAreLoaded } from './utils';

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
  if (elementToPatch && !elementToPatch.setCtx) {
    elementToPatch.setCtx = BlossomComponent.prototype.setCtx;
  }

  if (elementToPatch && !elementToPatch.ctx) {
    elementToPatch.ctx = BlossomResolveCtx(elementToPatch, true);
  }

  if (elementToPatch && !elementToPatch.props) {
    elementToPatch.props = getPropProxy(elementToPatch);
  }

  if (elementToPatch && !elementToPatch.resolveCtx) {
    elementToPatch.resolveCtx = () => {
      elementToPatch.ctx = BlossomResolveCtx(elementToPatch, true);
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
    this.ctx = {};
    this.props = getPropProxy(this);

    if (this.parentElement && !BlossomCheckParentsAreLoaded(this.parentElement)) return false;

    this._updateChildren(this.innerHTML);
    this.innerHTML = '';


    const ctx = BlossomResolveCtx(this);
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
    this.ctx = BlossomResolveCtx(this);
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
    addNeedRefresh(() => this.refreshTask());
  }

  refreshTask() {
    if (document.contains(this)) {
      const ctx = BlossomResolveCtx(this);
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

  setCtx(key, value) {
    if (key === '___RESULT') {
      return true;
    }
    if (typeof value === 'function') {
      value = `__FUNCTION__${value.toString()}`;
    }
    let willNeedRefresh = false;
    if (this.getAttribute('l-ctx')) {
      const temp = JSON.parse(this.getAttribute('l-ctx'));
      willNeedRefresh = JSON.stringify(this.ctx[key]) !== JSON.stringify(value);
      temp[key] = value;
      this.setAttribute('l-ctx', JSON.stringify(temp));
    } else {
      willNeedRefresh = JSON.stringify(this.ctx[key]) !== JSON.stringify(value);
      this.setAttribute('l-ctx', JSON.stringify({ [key]: value }));
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
  BlossomResolveCtx,
  BlossomInterpolate,
  BlossomReady,
};
