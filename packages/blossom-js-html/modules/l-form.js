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
    return `<form ${this.props.spread(['action', 'method', 'onsubmit', 'accept', 'autocomplete', 'enctype', 'name', 'target'])}>${this.props.children}</form>`;
  }
}

BlossomRegister({
  name: 'l-form',
  element: FormComponent,
});
