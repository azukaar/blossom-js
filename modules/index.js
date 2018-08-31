if (process.env.NODE_ENV === 'production') {
  require('@webcomponents/webcomponentsjs/bundles/webcomponents-ce');
}

import { BlossomReady, register, getCtx, interpolate, willRegisterAs, registerAs } from './utils';
import { BlossomElement } from './convertElement';
import createElement from './jsx';
import Component from './Component';
import { serialise, deserialise } from './serialise';

export {
  serialise,
  deserialise,
  createElement,
  Component,
  registerAs,
  willRegisterAs,
  BlossomElement,
  register,
  getCtx,
  interpolate,
  BlossomReady,
};
