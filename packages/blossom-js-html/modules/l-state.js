import { BlossomSetState, BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class StateComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      BlossomSetState(name, this.props[name]);
    });

    return '';
  }
}

BlossomRegister({
  name: 'l-state',
  element: StateComponent,
});
