const { emojify } = require('node-emoji');
const os = require('os');
const { exec } = require('./exec');

function emojifyArguments(args) {
  return args.map((arg) => {
    if (typeof arg == 'string') {
      return emojify(arg);
    }
    return arg;
  });
}

const print = {
  log(...args) {
    console.log(...emojifyArguments(args));
  },
  error(...args) {
    console.error(...emojifyArguments(args));
  },
  platformInfo() {
    print.log('******* :computer: Current environment :computer: *******');
    print.log(`  platform: ${os.platform()}\n  release: ${os.release()}\n  arch: ${exec('arch')}`);
    print.log('');
  },
};

module.exports = { print };
