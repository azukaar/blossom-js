import {BlossomComponent, BlossomRegister} from 'blossom-js-custom-element';

class RouteComponent extends BlossomComponent {
  getFullPath(element) {
    let r = '';
    if(element.tagName === 'L-ROUTE') r = element.getAttribute('l-path');

    if(element.parentElement)
      return getFullPath(element.parentElement) + '/' + r;
    else 
      return '';
  }

  match() {
    const currentPath = window.location.pathname;
    const url = this.getAttribute('l-path');
    let fullPath = this.getFullPath(this);
    const listMatch = [];

    fullUrl = "^" + fullUrl.replace(/\{\{(.*)\}\}/g, (match) => {
      match = match.replace(/^\{\{/, '').replace(/\}\}$/, '');
      listMatch.push(match);
      return "(\\w+)";
    });

    fullPath = fullPath.replace('/', '\/');


    const matches = currentPath.match(new RegExp(fullUrl));

    if(!matches) {
      return false;
    }
    else {
      let mlist =  {match : {}};
      for(let m = 1; m < matches.length; m++) {
        match = matches[m];
        mlist.match[ listMatch[m-1] ] = match;
      }

      return mlist;
    }
  }

  render() {
    const currentPath = window.location.pathname;
    const url = this.state['l-path'];
    const displayed = this.state['l-displayed'];
    const match = this.match();

    if(match && !displayed) {
      const matches = JSON.stringify(match);
      this.setAttribute('l-scope', matches);
      this.setAttribute('displayed', true);
      return this.state.children;
    }
    else if(match && displayed) {
      const old = this.getAttribute('l-scope');
      const newC = JSON.stringify(match);
      if(old != newC) {
        this.setAttribute('l-scope', newC);
        return this.state.children;
      }
    }
    else if(!match && displayed) {
      this.setAttribute('displayed', false);
      return '';
    }
  }
};

BlossomRegister({
    name : "l-route",
    element: RouteComponent
});