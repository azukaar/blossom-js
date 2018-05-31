import { Component, register } from 'blossom-js-custom-element';

class RouteComponent extends Component {
  getFullPath(element) {
    let r = '';
    if (element.tagName === 'L-ROUTE') r = element.getAttribute('path');

    if (element.parentElement) { return `${this.getFullPath(element.parentElement)}/${r}`; }
    return '';
  }

  match() {
    const currentPath = window.location.pathname;
    let fullPath = this.getAttribute('path'); // this.getFullPath(this);
    if (window.BlossomRouteBase) {
      fullPath = window.BlossomRouteBase + fullPath;
    }
    const listMatch = [];

    fullPath = `^${fullPath.replace(/\{\{(.*)\}\}/g, (match) => {
      const cleanMatch = match.replace(/^\{\{/, '').replace(/\}\}$/, '');
      listMatch.push(cleanMatch);
      return '(\\w+)';
    })}`;

    // eslint-disable-next-line no-useless-escape
    fullPath = `${fullPath.replace(/\/+/g, '\/')}$`;

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
    const match = this.match();

    if (match) {
      const matches = JSON.stringify(match);
      this.setAttribute('ctx', matches);
      return this.props.children;
    }

    return '';
  }
}

register({
  name: 'l-route',
  element: RouteComponent,
});
