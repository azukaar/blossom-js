import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class JsonComponent extends BlossomComponent {
  onMount() {
    this.state.loading = true;

    fetch(this.state.url)
      .then((res) => res.json())
      .then((json) => {
        this.state.loading = false;
        this.setAliasableScope(json, 'json');
        this.refresh();
      });
  }
  render() {
    if (this.state.loading) {
      return `<l-preview>${this.state.children}</l-preview>`;
    }

    return this.state.children;
  }
}

BlossomRegister({
  name: 'l-json',
  element: JsonComponent,
});
