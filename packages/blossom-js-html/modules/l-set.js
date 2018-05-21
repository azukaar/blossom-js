import { BlossomComponent, BlossomRegister, BlossomSerialise } from 'blossom-js-custom-element';

class SetComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const hasValue = BlossomSerialise(this.props[name]);

        if (!this.hasAttribute(`has_set_${name}`) || this.getAttribute(`has_set_${name}`) !== BlossomSerialise(hasValue)) {
          this.setAttribute(`has_set_${name}`, BlossomSerialise(hasValue));
          this.ctx[name] = this.props[name];
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
