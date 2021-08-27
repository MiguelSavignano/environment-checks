#! /usr/bin/env node
const fs = require('fs');
const os = require('os');
const axios = require('axios').default;
const get = require('lodash.get');
const { emojify } = require('node-emoji');
const compareVersions = require('compare-versions');
const HOME = process.env.WORKDIR_HOME || process.env.HOME;
const shell = require('shelljs');

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
    print.log("******* :computer: Current environment :computer: *******")
    print.log(
      `  platform: ${os.platform()}\n  release: ${os.release()}\n  arch: ${exec(
        'arch',
      )}`,
    );
    print.log("")
  },
};

function exec(command, options = {}) {
  return shell
    .exec(command, { silent: true, ...options })
    .toString()
    .trim();
}

class EnvironmentChecks {
  constructor({ messages = {}, ignoreErrors = [] }) {
    this.messages = messages;
    this.ignoreErrors = ignoreErrors;
    this.errors = [];
  }

  isSuccess() {
    return (
      this.errors.filter((errorName) => !this.ignoreErrors.includes(errorName))
        .length == 0
    );
  }

  getMessages(name) {
    return {
      success: get(this.mesages, `${name}[1]`, ''),
      failure: get(this.mesages, `${name}[2]`, ''),
    };
  }

  checkFile(name, path) {
    try {
      if (!fs.existsSync(path)) {
        print.error(
          `:x: [Error] missing file: ${path}`,
          this.getMessages(name).failure,
        );
        this.errors.push(name);
        return false;
      }
      print.log(
        `:heavy_check_mark: [Success] Found :dart: ${path} ${
          this.getMessages(name).success
        }`,
      );
      return true;
    } catch (err) {
      this.errors.push(name);
      console.error(err);
    }
  }

  checkVersion(name, currentVersion, [minVersion, maxVersion]) {
    const result = maxVersion
      ? compareVersions.compare(currentVersion, minVersion, '>=') &&
        compareVersions.compare(currentVersion, maxVersion, '<')
      : compareVersions.compare(currentVersion, minVersion, '>=');
    if (!result) {
      print.error(
        `:mega: [Error] Not suported version ${currentVersion} for ${name}; Install the version ${minVersion} ${
          this.getMessages(name).failure
        }`,
      );
      this.errors.push(name);
      return false;
    }
    print.log(
      `:heavy_check_mark: [Success] ${
        this.getMessages(name).success
      } version ${currentVersion} suported :tada:`,
    );
    return true;
  }

  async checkAvailablePort(name, port) {
    try {
      await axios(`http://localhost:${port}`);
      print.error(
        `:x: [Error] Some service is running on port: ${port}`,
        this.getMessages(name).failure,
      );
      this.errors.push(name);
      return false;
    } catch {
      print.log(
        `:heavy_check_mark: [Success] Available port: ${port} :computer: ${
          this.getMessages(name).success
        }`,
      );
      return true;
    }
  }

  async checkFileContains(name, source, content) {
    try {
      if (
        !fs
          .readFileSync('/etc/hosts', 'utf-8')
          .includes(fs.readFileSync(content))
      ) {
        print.error(
          `:x: [Error] The file ${source} not contains ${content} :loudspeaker:`,
          this.getMessages(name).failure,
        );
        this.errors.push(name);
        return false;
      }
      print.log(
        `:heavy_check_mark: [Success] In the file ${content} :memo:, ${
          this.getMessages(name).success
        }`,
      );
      return true;
    } catch (err) {
      this.errors.push(name);
      console.error(err);
    }
  }
}

module.exports = {
  print,
  exec,
  EnvironmentChecks,
};
