/* eslint-disable no-param-reassign */
import { BlossomComponent } from './index';
import { getPropProxy, getCtx, setEventListener, setClassNames } from './utils';

function BlossomConvertElement(elementToPatch) {
  if (elementToPatch && !elementToPatch.setCtx) {
    elementToPatch.setCtx = BlossomComponent.prototype.setCtx;
  }

  if (elementToPatch && !elementToPatch.ctx) {
    elementToPatch.ctx = getCtx(elementToPatch);
  }

  if (elementToPatch && !elementToPatch.props) {
    elementToPatch.props = getPropProxy(elementToPatch);
  }

  if (elementToPatch && !elementToPatch.resolveCtx) {
    elementToPatch.resolveCtx = () => {
      elementToPatch.ctx = getCtx(elementToPatch);
    };
  }

  if (elementToPatch && !elementToPatch.refresh) {
    elementToPatch.refresh = () => {
      elementToPatch.innerHTML = elementToPatch.innerHTML;
      setClassNames(elementToPatch);
      setEventListener(elementToPatch);
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
        get: () => BlossomConvertElement(element[`native${acc}`]),
      });
    }
  });
}

export { BlossomConvertElement, patchDomAccess };
