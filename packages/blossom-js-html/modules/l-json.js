import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class JsonComponent extends BlossomComponent {
  onMount() {
    this.props.loading = true;

    fetch(this.props.url)
      .then((res) => res.json())
      .then((json) => {
        this.props.loading = false;
        this.setAliasableScope(json, 'json');
        this.refresh();
      });
  }
  render() {
    if (this.props.loading) {
      return `<l-preview>${this.props.children}</l-preview>`;
    }

    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-json',
  element: JsonComponent,
});
