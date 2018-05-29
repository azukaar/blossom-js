import { deserialise, serialise } from '../serialise';
import { convertElement } from '../convertElement';

function getCtx(element, preventRecursion) {
  let ctx = {};

  if (element.parentElement && !preventRecursion) {
    ctx = getCtx(element.parentElement);
  }

  if (element.getAttribute('ctx')) {
    const elementCtx = deserialise(element.getAttribute('ctx'), element);

    Object.keys(elementCtx).forEach(va => {
      ctx[va] = elementCtx[va];
    });
  }

  return ctx;
}

function setCtx(element, pendingCtx) {
  const oldCtx = element.getAttribute('ctx');
  const elementCtx = oldCtx && deserialise(oldCtx, element);
  let nextCtx = {};
  let willRefresh = false;
  let newCtx;

  if (oldCtx && element.parentElement && element.parentElement.tagName !== 'HTML') {
    Object.keys(pendingCtx).forEach(va => {
      if (elementCtx[va]) {
        elementCtx[va] = pendingCtx[va];
      } else {
        nextCtx[va] = pendingCtx[va];
      }
    });

    newCtx = serialise(elementCtx);
    element.setAttribute('ctx', newCtx);
  } else {
    nextCtx = pendingCtx;
  }

  if (element.parentElement && element.parentElement.tagName !== 'HTML') {
    willRefresh = setCtx(element.parentElement, nextCtx);
  } else {
    willRefresh = newCtx !== oldCtx;
    if (willRefresh) {
      element.setAttribute('ctx', serialise(pendingCtx));
      convertElement(element).refresh();
    }
    return willRefresh;
  }

  if (oldCtx && newCtx && !willRefresh && newCtx !== oldCtx) {
    element.refresh();
    return true;
  }
}

function contextTrap(element, func, args = []) {
  element.ctx = getCtx(element);
  const oldContext = serialise(element.ctx);
  const result = func(...args);

  if (serialise(element.ctx) !== oldContext) {
    setCtx(element, element.ctx);
  }

  return result;
}

export { getCtx, setCtx, contextTrap };
