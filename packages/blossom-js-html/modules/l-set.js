import { BlossomComponent, BlossomRegister, BlossomSerialise } from 'blossom-js-custom-element';

class SetComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const setValue = BlossomSerialise(this.props[name]);

        if (!this.hasAttribute(`has_set_${name}`) || this.getAttribute(`has_set_${name}`) !== setValue) {
          this.setAttribute(`has_set_${name}`, setValue);
          this.ctx[name] = setValue;
        }
      }
    });

    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-set',
  element: SetComponent,
});
