import { BlossomConvertElement } from '../BlossomConvertElement';
import { BlossomDeserialise } from '../BlossomSerialise';

export default function getCtxProxy(element, preventRecursion) {
  let ctx = new Proxy({
    realCtx: {},
    setFunctions: {},
  }, {
    ownKeys: (target) => Reflect.ownKeys(target.realCtx),
    deleteProperty() {
      // TODO
      return true;
    },
    getOwnPropertyDescriptor: (target, attr) => {
      if (attr === 'setFunctions' || attr === 'realCtx' || attr === 'originalElement') {
        return {
          value: target[attr],
          writable: true,
          enumerable: true,
          configurable: true,
        };
      } else if (typeof attr === 'string' && attr.length > 0) {
        return {
          value: target.realCtx[attr],
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }
    },
    get: (target, attr) => {
      if (attr === 'setFunctions' || attr === 'realCtx' || attr === 'originalElement') {
        return target[attr];
      }
      return target.realCtx[attr];
    },
    /* eslint-disable no-param-reassign */
    set: (target, attr, value) => {
      if (attr === 'setFunctions' || attr === 'realCtx' || attr === 'originalElement') {
        target[attr] = value;
        return true;
      }
      target.realCtx[attr] = value;
      if (!target.setFunctions[attr]) {
        target.setFunctions[attr] = () =>
          BlossomConvertElement(target.originalElement).setCtx(attr, value);
      }
      target.setFunctions[attr](value);
      return true;
    },
  });

  if (element.parentElement && !preventRecursion) {
    ctx = getCtxProxy(element.parentElement);
  }

  ctx.originalElement = element;

  if (element.getAttribute('l-ctx')) {
    const elementCtx = BlossomDeserialise(element.getAttribute('l-ctx'), element);

    Object.keys(elementCtx).forEach(va => {
      ctx.realCtx[va] = elementCtx[va];
      ctx.setFunctions[va] = (value) => {
        BlossomConvertElement(element).setCtx(va, value);
      };
    });
  }

  return ctx;
}
/* eslint-enable no-param-reassign */
