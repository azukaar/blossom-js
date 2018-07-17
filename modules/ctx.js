import { deserialise, serialise } from './serialise';
import { BlossomElement, nativeSetAttribute } from './convertElement';

function getCtx(element, preventRecursion) {
  let ctx = {};
  if (element.parentElement && !preventRecursion && element.parentElement.tagName !== 'L-CLOSURE' && element.parentElement.tagName !== 'HTML') {
    ctx = getCtx(element.parentElement);
  }

  if (element.getAttribute('ctx')) {
    const elementCtx = deserialise(element.getAttribute('ctx'), element);

    Object.keys(elementCtx).forEach((va) => {
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

  if (oldCtx && element.parentElement && element.parentElement.tagName !== 'HTML' && element.parentElement.tagName !== 'L-CLOSURE') {
    Object.keys(pendingCtx).forEach((va) => {
      if (typeof elementCtx[va] !== 'undefined') {
        elementCtx[va] = pendingCtx[va];
      } else {
        nextCtx[va] = pendingCtx[va];
      }
    });

    newCtx = serialise(elementCtx);
    nativeSetAttribute(element, 'ctx', newCtx);
  } else {
    nextCtx = pendingCtx;
  }

  if (element.parentElement && element.parentElement.tagName !== 'HTML' && element.parentElement.tagName !== 'L-CLOSURE') {
    willRefresh = setCtx(element.parentElement, nextCtx);
  } else {
    const bodyCtx = serialise(pendingCtx);
    willRefresh = bodyCtx !== oldCtx;
    if (willRefresh) {
      nativeSetAttribute(element, 'ctx', serialise(bodyCtx));
      BlossomElement(element).refresh();
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
