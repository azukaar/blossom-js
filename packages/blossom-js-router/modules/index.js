import './l-a';
import './l-route';

const BlossomRouter = {
  routeListeners: [],
};

if (typeof window !== 'undefined') {
  window.navigateTo = function navigateTo(url) {
    window.history.pushState({}, '', url);

    Array.from(document.querySelectorAll('l-route')).forEach((route) => {
      route.refresh();
    });
  };

  window.onpopstate = function onpopstate() {
    BlossomRouter.routeListeners.map(route => route.refresh());
  };
}

export default BlossomRouter;
