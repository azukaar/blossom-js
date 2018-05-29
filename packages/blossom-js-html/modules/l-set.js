import { Component, register, serialise } from 'blossom-js-custom-element';

class SetComponent extends Component {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const setValue = serialise(this.props[name]);

        if (!this.hasAttribute(`has_set_${name}`) || this.getAttribute(`has_set_${name}`) !== setValue) {
          this.setAttribute(`has_set_${name}`, setValue);
          this.ctx[name] = setValue;
        }
      }
    });

    return this.props.children;
  }
}

register({
  name: 'l-set',
  element: SetComponent,
});
