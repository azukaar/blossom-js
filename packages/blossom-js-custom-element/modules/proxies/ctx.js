import { BlossomConvertElement } from '../BlossomConvertElement';

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
    const elementCtx = JSON.parse(element.getAttribute('l-ctx'));

    /* eslint-disable no-inner-declarations, guard-for-in, no-restricted-syntax, no-eval */
    function searchFunctions(current) {
      for (const index in current) {
        if (current[index] && current[index].match && current[index].match(/^__FUNCTION__/)) {
          let tostring = current[index].slice(12);

          if (!tostring.match(/^\s*function/)) {
            tostring = `(function${tostring}})`;
            tostring = tostring.replace('=>', '{return ');
          }
          // NEED DELETE ?
          BlossomConvertElement(element);
          current[index] = eval(tostring).bind(element);
        }

        if (current[index] !== null && typeof (current[index]) === 'object') {
          searchFunctions(current[index]);
        }
      }
    }
    /* eslint-enable no-inner-declarations, guard-for-in, no-restricted-syntax, no-eval */

    searchFunctions(elementCtx);

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
