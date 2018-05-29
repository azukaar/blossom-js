/* eslint-disable no-param-reassign */
import { Component } from './index';
import { getPropProxy, getCtx, interpolateAttributes } from './utils';

function convertElement(elementToPatch) {
  if (elementToPatch && !elementToPatch.setCtx) {
    elementToPatch.setCtx = Component.prototype.setCtx;
  }

  if (elementToPatch && !elementToPatch.ctx) {
    elementToPatch.ctx = getCtx(elementToPatch);
  }

  if (elementToPatch && !elementToPatch.props) {
    elementToPatch.props = getPropProxy(elementToPatch);
  }

  if (elementToPatch && !elementToPatch.refresh) {
    elementToPatch.refresh = () => {
      elementToPatch.innerHTML = elementToPatch.innerHTML;
      interpolateAttributes(elementToPatch);
    };
  }

  return elementToPatch;
}

function patchDomAccess(element) {
  ['parentElement'].forEach(acc => {
    if (Object.getOwnPropertyDescriptor(element, acc) &&
        Object.getOwnPropertyDescriptor(element, acc).writable) {
      element[`native${acc}`] = element[acc];

      Object.defineProperty(element, acc, {
        get: () => convertElement(element[`native${acc}`]),
      });
    }
  });
}

export { convertElement, patchDomAccess };
