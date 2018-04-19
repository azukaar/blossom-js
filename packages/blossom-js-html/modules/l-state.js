import { BlossomSetState, BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class StateComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      if (!name.match(/^has_set_/)) {
        const hasValue = (typeof this.props[name] === 'function') ? this.props[name].toString() : this.props[name];

        if (!this.hasAttribute('has_set_'+name) || this.getAttribute('has_set_'+name) !== hasValue) {
          this.setAttribute('has_set_'+name, hasValue);
          BlossomSetState(name, this.props[name], this);
        }
      }
    });

    return '';
  }
}

BlossomRegister({
  name: 'l-state',
  element: StateComponent,
});
