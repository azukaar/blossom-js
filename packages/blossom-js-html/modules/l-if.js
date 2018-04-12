import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class IfComponent extends BlossomComponent {
  render() {
    if (this.state.cond) {
      return this.state.children;
    }
    return '';
  }
}

BlossomRegister({
  name: 'l-if',
  element: IfComponent,
});
