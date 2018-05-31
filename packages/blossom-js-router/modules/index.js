import { BlossomReady } from 'blossom-js-custom-element';
import './l-a';
import './l-redirect';
import './l-meta-route';
import './l-route';

const BlossomRouter = {
  routeListeners: [],
};

if (typeof window !== 'undefined') {
  window.navigateTo = function navigateTo(url) {
    BlossomReady.then(() => {
      if (url.match(/^\//)) {
        let fullPath = url;

        if (window.BlossomRouteBase) {
          fullPath = window.BlossomRouteBase + fullPath.slice(1);
        }

        window.history.pushState({}, '', fullPath);
      } else {
        window.history.pushState({}, '', window.location.pathname + url);
      }

      Array.from(document.querySelectorAll('l-route')).forEach((route) => {
        route.refresh();
      });

      Array.from(document.querySelectorAll('l-a')).forEach((link) => {
        link.refresh();
      });
    });
  };

  window.onpopstate = function onpopstate() {
    BlossomRouter.routeListeners.map(route => route.refresh());
  };
}

export default BlossomRouter;
