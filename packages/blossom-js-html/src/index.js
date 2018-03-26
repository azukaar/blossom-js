const required = {
    "l-if": require('./l-if'),
    "l-loop": require('./l-loop'),
    "l-js": require('./l-js'),
    "l-preview": require('./l-preview'),
    "l-json": require('./l-json'),
}

if(typeof module !== 'undefined' && module.exports) {
    module.exports = required;
}