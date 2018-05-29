import { Component, register } from 'blossom-js-custom-element';

class FormComponent extends Component {
  updateChildren() {
    if (this.querySelectorAll('l-error').length > 0) {
      Array.from(this.querySelectorAll('input[type="submit"]')).map(e => e.setAttribute('disabled', true));
    } else {
      Array.from(this.querySelectorAll('input[type="submit"]')).map(e => e.removeAttribute('disabled'));
    }
  }

  render() {
    return `<form ${this.props.spread(['action', 'method', 'accept', 'autocomplete', 'enctype', 'name', 'target'])}>${this.props.children}</form>`;
  }
}

register({
  name: 'l-form',
  element: FormComponent,
});
