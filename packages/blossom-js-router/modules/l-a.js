import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class AComponent extends BlossomComponent {
  render() {
    return `<a onclick="event.preventDefault(); navigateTo('${this.props.href}')" href='${this.props.href}'>${this.props.children}</a>`;
  }
}

BlossomRegister({
  name: 'l-a',
  element: AComponent,
});
