import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class RouteComponent extends BlossomComponent {
  getFullPath(element) {
    let r = '';
    if (element.tagName === 'L-ROUTE') r = element.getAttribute('l-path');

    if (element.parentElement) { return `${this.getFullPath(element.parentElement)}/${r}`; }
    return '';
  }

  match() {
    const currentPath = window.location.pathname;
    let fullPath = this.getFullPath(this);
    const listMatch = [];

    fullPath = `^${fullPath.replace(/\{\{(.*)\}\}/g, (match) => {
      const cleanMatch = match.replace(/^\{\{/, '').replace(/\}\}$/, '');
      listMatch.push(cleanMatch);
      return '(\\w+)';
    })}`;

    // eslint-disable-next-line no-useless-escape
    fullPath = fullPath.replace(/\/+/, '\/');

    const matches = currentPath.match(new RegExp(fullPath));

    if (!matches) {
      return false;
    }

    const mlist = { match: {} };
    for (let m = 1; m < matches.length; m += 1) {
      const match = matches[m];
      mlist.match[listMatch[m - 1]] = match;
    }

    return mlist;
  }

  render() {
    const displayed = this.state['l-displayed'];
    const match = this.match();

    if (match && !displayed) {
      const matches = JSON.stringify(match);
      this.setAttribute('l-scope', matches);
      this.state['l-displayed'] = true;
      return this.state.children;
    } else if (match && displayed) {
      const old = this.getAttribute('l-scope');
      const newC = JSON.stringify(match);
      if (old !== newC) {
        this.setAttribute('l-scope', newC);
        return this.state.children;
      }
    } else if (!match && displayed) {
      this.state['l-displayed'] = false;
      return '';
    }
  }
}

BlossomRegister({
  name: 'l-route',
  element: RouteComponent,
});
