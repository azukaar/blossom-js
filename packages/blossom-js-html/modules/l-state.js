import { BlossomRefreshState, BlossomComponent, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class StateComponent extends BlossomComponent {
  render() {
    if (!window.state) window.state = {};
    let attrName = this.attributes[0].name;
    let value = this.getAttribute(attrName);

    if (attrName.match(/^l-/)) {
      attrName = attrName.slice(2);
      value = BlossomInterpolate(value, this.state.scope, this);
    }

    window.state[attrName] = value;

    BlossomRefreshState();
    return '';
  }
}

BlossomRegister({
  name: 'l-state',
  element: StateComponent,
});
