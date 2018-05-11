import { BlossomComponent, BlossomRegister, BlossomSerialise } from 'blossom-js-custom-element';

class SetComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const hasValue = (typeof this.props[name] === 'function') ? this.props[name].toString() : this.props[name];

        if (!this.hasAttribute(`has_set_${name}`) || this.getAttribute(`has_set_${name}`) !== BlossomSerialise(hasValue)) {
          if (this.ctx[name]) {
            this.setAttribute(`has_set_${name}`, BlossomSerialise(hasValue));
            this.ctx[name] = this.props[name];
          } else {
            this.setAttribute(`has_set_${name}`, BlossomSerialise(hasValue));
            if (document.body) {
              document.body.setCtx(name, this.props[name]);
            } else {
              document.querySelector('*').setCtx(name, this.props[name]);
            }
          }
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
