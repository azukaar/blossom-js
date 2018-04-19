import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class redirectComponent extends BlossomComponent {
  render() {
    navigateTo(this.props.to);
  }
}

BlossomRegister({
  name: 'l-redirect',
  element: redirectComponent,
});
