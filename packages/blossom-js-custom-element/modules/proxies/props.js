import { BlossomInterpolate } from '../utils';

export default function getPropProxy(mainElement) {
  return new Proxy({}, {
    ownKeys: () => {
      const attrs = [];

      Array.from(mainElement.attributes)
        .filter(e => e.name !== 'children' && e.name !== 'ctx' && e.name !== 'l-ctx' &&
                e.name !== 'l-class' && e.name !== 'class' &&
                e.name !== 'l-style' && e.name !== 'style')
        .forEach(e => {
          if (e.name.match(/^l-/)) {
            const realName = e.name.slice(2);
            if (attrs.indexOf(realName === -1)) attrs.push(realName);
          } else if (attrs.indexOf(e.name) === -1) {
            attrs.push(e.name);
          }
        });

      return attrs;
    },
    deleteProperty(target, attr) {
      if (attr !== 'ctx' && typeof attr === 'string') {
        if (mainElement.hasAttribute(attr)) {
          mainElement.removeAttribute(attr);
        }
        if (mainElement.hasAttribute(`l-${attr}`)) {
          mainElement.removeAttribute(`l-${attr}`);
        }
      }
      mainElement.refresh();
      return true;
    },

    getOwnPropertyDescriptor: (oTarget, sKey) => ({
      value: mainElement.props[sKey],
      writable: true,
      enumerable: true,
      configurable: true,
    }),

    get: (obj, attr) => {
      if (attr === 'spread') {
        return (filterin) => {
          const attrs = [];

          Array.from(mainElement.attributes)
            .filter(e => e.name !== 'children' && e.name !== 'ctx' && e.name !== 'l-ctx' &&
                    e.name !== 'l-class' && e.name !== 'class' &&
                    e.name !== 'l-style' && e.name !== 'style')
            .forEach(e => {
              if (e.name.match(/^l-/)) {
                const realName = e.name.slice(2);
                if (attrs.indexOf(realName === -1)) attrs[realName] = mainElement.props[realName];
              } else if (attrs.indexOf(e.name) === -1) {
                attrs[e.name] = mainElement.props[e.name];
              }
            });

          if (filterin) {
            Object.keys(attrs).forEach(att => {
              if (filterin.indexOf(att) === -1) {
                delete attrs[att];
              }
            });
          }

          return Object.keys(attrs).map((key) => `${key}="${attrs[key]}"`).join(' ');
        };
      } else if (attr === 'ctx') {
        return mainElement.ctx;
      } else if (attr === 'children') return mainElement.getAttribute('children');
      else if (typeof attr === 'string' && attr.length > 0) {
        if (mainElement.getAttribute(`l-${attr}`)) {
          const result = BlossomInterpolate(mainElement.getAttribute(`l-${attr}`), mainElement);
          mainElement.setAttribute(attr, typeof result !== 'string' ? JSON.stringify(result) : result);
          return result;
        }

        if (mainElement.getAttribute(attr)) {
          const result = mainElement.getAttribute(attr);
          if (result === 'true') return true;
          else if (result === 'false') return false;
          else if (result.match(/^[{[]/) && result.match(/[}]]$/)) {
            try {
              return JSON.stringify(result);
            } catch (e) {
              return result;
            }
          } else if (typeof result === 'number') return Number(result);
          return result;
        }

        return '';
      }
    },
    /* eslint-disable no-param-reassign */
    set: (obj, attr, value) => {
      if (attr === 'ctx') {
        const needRefresh = JSON.stringify(mainElement.ctx) !== JSON.stringify(value);

        mainElement.ctx = value;
        if (needRefresh) mainElement.refresh();
      } else if (attr === 'children') {
        mainElement.setAttribute(attr, typeof value !== 'string' ? JSON.stringify(value) : value);
      } else if (typeof attr === 'string') {
        const needRefresh = mainElement.getAttribute(attr) !== value.toString ? value.toString :
          JSON.stringify(value);

        mainElement.setAttribute(attr, typeof value !== 'string' ? JSON.stringify(value) : value);
        if (needRefresh) mainElement.refresh();
      }
      return true;
    },
    /* eslint-enable no-param-reassign */
  });
}
