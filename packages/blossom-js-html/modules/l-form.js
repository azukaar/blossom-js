import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class FormComponent extends BlossomComponent {
  updateChildren(children) {
    this.props.children = children.unwrap('form');

    if (this.querySelectorAll('l-error').length > 0) {
      Array.from(this.querySelectorAll('input[type="submit"]')).map(e => e.setAttribute('disabled', true));
    } else {
      Array.from(this.querySelectorAll('input[type="submit"]')).map(e => e.removeAttribute('disabled'));
    }
  }

  render() {
    return `<form method="${this.props.method}" action="${this.props.action}" >${this.props.children}</form>`;
  }
}

BlossomRegister({
  name: 'l-form',
  element: FormComponent,
});
