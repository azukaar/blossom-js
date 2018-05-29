import { Component, register, serialise } from 'blossom-js-custom-element';

class CtxComponent extends Component {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const hasValue = serialise(this.props[name]);

        if (!this.hasAttribute(`has_set_${name}`) || this.getAttribute(`has_set_${name}`) !== hasValue) {
          this.setAttribute(`has_set_${name}`, hasValue);
          this.setCtx(name, this.props[name]);
        }
      }
    });

    return this.props.children;
  }
}

register({
  name: 'l-ctx',
  element: CtxComponent,
});
