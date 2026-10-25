// Windows sandbox compatibility: use synchronous realpath behind the Promise API.
const fs = require('node:fs');
fs.promises.realpath = async (path, options) => fs.realpathSync(path, options);
