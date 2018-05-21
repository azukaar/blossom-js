import { BlossomDeserialise, BlossomSerialise } from '../BlossomSerialise';
import { BlossomConvertElement } from '../BlossomConvertElement';

function getCtx(element, preventRecursion) {
  let ctx = {};

  if (element.parentElement && !preventRecursion) {
    ctx = getCtx(element.parentElement);
  }

  if (element.getAttribute('l-ctx')) {
    const elementCtx = BlossomDeserialise(element.getAttribute('l-ctx'), element);

    Object.keys(elementCtx).forEach(va => {
      ctx[va] = elementCtx[va];
    });
  }

  return ctx;
}

function setCtx(element, pendingCtx) {
  const oldCtx = element.getAttribute('l-ctx');
  const elementCtx = oldCtx && BlossomDeserialise(oldCtx, element);
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

    newCtx = BlossomSerialise(elementCtx);
    element.setAttribute('l-ctx', newCtx);
  } else {
    nextCtx = pendingCtx;
  }

  if (element.parentElement && element.parentElement.tagName !== 'HTML') {
    willRefresh = setCtx(element.parentElement, nextCtx);
  } else {
    willRefresh = newCtx !== oldCtx;
    if (willRefresh) {
      element.setAttribute('l-ctx', BlossomSerialise(pendingCtx));
      BlossomConvertElement(element).refresh();
    }
    return willRefresh;
  }

  if (oldCtx && newCtx && !willRefresh && newCtx !== oldCtx) {
    element.refresh();
    return true;
  }
}

function contextTrap(element, func) {
  const oldContext = BlossomSerialise(element.ctx);
  const result = func();

  if (BlossomSerialise(element.ctx) !== oldContext) {
    setCtx(element, element.ctx);
  }

  return result;
}

export { getCtx, setCtx, contextTrap };
