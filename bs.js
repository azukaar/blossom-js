/* eslint-disable */

const browserSync = require("browser-sync").create();
const historyApiFallback = require('connect-history-api-fallback')

browserSync.init({
    files: ["**/**"],
    server: {
        middleware: [ historyApiFallback({
          rewrites: [
            { from: /(css|jpg|png|gif)$/, to: (context) => context.parsedUrl.pathname },
            { from: /\/doc/, to: '/doc/index.html' },
            { from: /\/examples\/ToDo/, to: '/examples/ToDo/index.html' },
            { from: /\/examples\/weather/, to: '/examples/weather/index.html' },
          ]
        })]
    }
});