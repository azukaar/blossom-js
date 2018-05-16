import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class IfComponent extends BlossomComponent {
  render() {
    if (this.props.cond) {
      return this.props.children;
    }
    return '';
  }
}

BlossomRegister({
  name: 'l-if',
  element: IfComponent,
});
