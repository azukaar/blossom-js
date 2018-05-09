import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class ErrorComponent extends BlossomComponent {
  render() {
    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-error',
  element: ErrorComponent,
});
