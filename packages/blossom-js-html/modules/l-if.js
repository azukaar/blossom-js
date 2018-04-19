import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class IfComponent extends BlossomComponent {
  updateChildren(children) {
    if (children.length) {
      this.props.children = children;
    }
  }
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
