import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class SetComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const hasValue = (typeof this.props[name] === 'function') ? this.props[name].toString() : this.props[name];

        if (!this.hasAttribute('has_set_'+name) || this.getAttribute('has_set_'+name) !== JSON.stringify(hasValue)) {
          if (this.scope[name]) {
            this.setAttribute('has_set_'+name, JSON.stringify(hasValue));
            this.scope[name] = this.props[name];
          } else {
            this.setAttribute('has_set_'+name, JSON.stringify(hasValue));
            document.body.setScope(name, this.props[name]);
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
