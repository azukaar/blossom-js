import { serialise } from './serialise';
import { elementregistered } from './utils';

const processProp = function (index, value) {
  let realIndex = index;
  let realValue = value;

  switch (index) {
    case 'className':
      realIndex = 'class';
      break;
    case 'cssFor':
      realIndex = 'for';
      break;
    case 'style': {
      let string = '';

      for (let key in value) {
        const styleValue = value[key];

        key = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);

        string += `${(string ? ' ' : '') + key}: ${styleValue};`;
      }

      realValue = string;
    }
    default: realIndex = realIndex.toLowerCase();
  }

  return `${realIndex}="${serialise(realValue)}"`;
};

const createElement = function (tag, props = {}, ...children) {
  let propsString = '';

  for (const index in props) {
    propsString += `${processProp(index, props[index])} `;
  }

  if(typeof tag === 'string') {
    return `<${tag} ${propsString}>${children.join('')}</${tag}>`;
  }
  else {
    const element = elementregistered(tag.willRegisterAs);
    const registeredName = element.registeredName;
    let tagName = tag.willRegisterAs;

    if(typeof tag.willRegisterAs === 'undefined' || !tag.willRegisterAs.length) {
      tagName = tag.register('no-name-' + parseInt(Math.random() * 10000));
    }
    else if(registeredName && element !== tag) {
      const name = tag.willRegisterAs;
      tagName = tag.register(name + '-' + parseInt(Math.random() * 100));
    }
    else if (!registeredName) {
      const name = tag.willRegisterAs;
      tagName = tag.register(name);
    }

    return `<${tagName} ${propsString}>${children.join('')}</${tagName}>`;
  }
};


export default createElement;
