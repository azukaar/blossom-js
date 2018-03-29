import './l-a';
import './l-route';

const BlossomRouter = {
    routeListeners: [],
}

if(typeof window !== 'undefined') {
    window.navigateTo = function (url) {
        const oldPath = window.location.pathname;
        window.history.pushState({},"", url);
        for(r in BlossomRouter.routeListeners) {
            BlossomRouter.routeListeners[r].refresh();
        }
        window._currentPath = url;
    }

    window.onpopstate = function (event) {
        const oldPath = window._currentPath;
        const newPath = window.location.pathname;

        for(r in BlossomRouter.routeListeners) {
            BlossomRouter.routeListeners[r].refresh();
        }

        window._currentPath = newPath;
    };
}

export default BlossomRouter;