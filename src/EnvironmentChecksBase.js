const fs = require('fs');
const axios = require('axios').default;
const get = require('lodash.get');
const compareVersions = require('compare-versions');
const { print } = require('./print');

class EnvironmentChecksBase {
  constructor({ messages = {}, ignoreErrors = [] } = {}) {
    this.messages = messages;
    this.ignoreErrors = ignoreErrors;
    this.errors = [];
  }

  isSuccess() {
    return this.errors.filter((errorName) => !this.ignoreErrors.includes(errorName)).length == 0;
  }

  getMessages(name) {
    return {
      success: get(this.messages, `${name}[0]`, ''),
      failure: get(this.messages, `${name}[1]`, ''),
    };
  }

  checkFile(name, path) {
    try {
      if (!fs.existsSync(path)) {
        print.error(`:x: [Error] missing file: ${path}`, this.getMessages(name).failure);
        this.errors.push(name);
        return false;
      }
      print.log(`:heavy_check_mark: [Success] Found :dart: ${path} ${this.getMessages(name).success}`);
      return true;
    } catch (err) {
      this.errors.push(name);
      console.error(err);
    }
  }

  checkVersion(name, currentVersion, [minVersion, maxVersion]) {
    if (!currentVersion) {
      print.error(
        `:mega: [Error] Not found version for ${name}; check your installation of ${name} ${
          this.getMessages(name).failure
        }`
      );
      this.errors.push(name);
      return false;
    }
    const result = maxVersion
      ? compareVersions.compare(currentVersion, minVersion, '>=') &&
        compareVersions.compare(currentVersion, maxVersion, '<')
      : compareVersions.compare(currentVersion, minVersion, '>=');
    if (!result) {
      console.log('**********************');
      print.error(
        `:mega: [Error] Not suported version ${currentVersion} for ${name}; Install the version ${minVersion} ${
          this.getMessages(name).failure
        }`
      );
      this.errors.push(name);
      return false;
    }
    print.log(
      `:heavy_check_mark: [Success] ${this.getMessages(name).success} version ${currentVersion} suported :tada:`
    );
    return true;
  }

  async checkAvailablePort(name, port) {
    try {
      await axios(`http://localhost:${port}`);
      print.error(`:x: [Error] Some service is running on port: ${port}`, this.getMessages(name).failure);
      this.errors.push(name);
      return false;
    } catch {
      print.log(`:heavy_check_mark: [Success] Available port: ${port} :computer: ${this.getMessages(name).success}`);
      return true;
    }
  }

  async checkFileContains(name, source, content) {
    try {
      if (!fs.readFileSync(source, 'utf-8').includes(content)) {
        print.error(
          `:x: [Error] The file ${source} not contains ${content} :loudspeaker:`,
          this.getMessages(name).failure
        );
        this.errors.push(name);
        return false;
      }
      print.log(`:heavy_check_mark: [Success] In the file ${content} :memo:, ${this.getMessages(name).success}`);
      return true;
    } catch (err) {
      this.errors.push(name);
      console.error(err);
    }
  }
}
module.exports = { EnvironmentChecksBase };
