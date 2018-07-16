import { Component } from './index';
import { getPropProxy, getCtx, interpolateAttributes } from './utils';

function BlossomElement(elementToPatch) {
  return {
    setCtx: (elementToPatch.setCtx) ?
      elementToPatch.setCtx :
      Component.prototype.setCtx,

    ctx: (elementToPatch.ctx) ?
      elementToPatch.ctx :
      getCtx(elementToPatch),

    props: (elementToPatch.props) ?
      elementToPatch.props :
      getPropProxy(elementToPatch),

    refresh: (...args) => {
      if (elementToPatch.refresh) {
        elementToPatch.refresh(...args);
      } else {
        const elements = elementToPatch.childNodes;

        for (let i = 0; i < elements.length; i += 1) {
          const n = elements[i];
          if (n.nodeType === Node.ELEMENT_NODE) {
            BlossomElement(n).refresh();
          }
        }

        interpolateAttributes(elementToPatch);
      }
    },
  };
}

function BlossomProxyElement(elementToPatch) {
  return new Proxy(elementToPatch, {
    // eslint-disable-next-line no-confusing-arrow
    get: (obj, prop) => {
      if (prop in obj) {
        return obj[prop].bind ? obj[prop].bind(obj) : obj[prop];
      }
      return BlossomElement(obj)[prop];
    },
  });
}

function nativeSetAttribute(el, name, value) {
  if (el.nativeSetAttribute) {
    el.nativeSetAttribute(name, value);
  } else {
    el.setAttribute(name, value);
  }
}

function nativeRemoveAttribute(el, name) {
  if (el.nativeRemoveAttribute) {
    el.nativeRemoveAttribute(name);
  } else {
    el.removeAttribute(name);
  }
}

export {
  BlossomElement,
  BlossomProxyElement,
  nativeSetAttribute,
  nativeRemoveAttribute
};
