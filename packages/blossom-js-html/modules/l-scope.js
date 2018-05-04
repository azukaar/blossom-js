import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class ScopeComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const hasValue = (typeof this.props[name] === 'function') ? this.props[name].toString() : this.props[name];

        if (!this.hasAttribute('has_set_'+name) || this.getAttribute('has_set_'+name) !== hasValue) {
          this.setAttribute('has_set_'+name, hasValue);
          this.setScope(name, this.props[name]);
        }
      }
    });

    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-scope',
  element: ScopeComponent,
});
