const shell = require('shelljs');

function exec(command, options = {}) {
  return shell
    .exec(command, { silent: true, ...options })
    .toString()
    .trim();
}

module.exports = { exec }
