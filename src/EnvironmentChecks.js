const { print } = require('./print');
const { exec } = require('./exec');
const { EnvironmentChecksBase } = require('./EnvironmentChecksBase');

class EnvironmentChecks extends EnvironmentChecksBase {
  constructor(data = {}) {
    const defaultMessages = {
      dotenv: ['', `You need to create the .env file with the correct values`],
      npm_auth: ['', `You need to login with npm`],
      gcloud_config: ['', `You need to login with gcloud (gcloud auth application-default login)`],
      docker: ['Docker :whale:', '(https://docs.docker.com/get-docker/)'],
      docker_compose: ['Docker compose :whale: :whale:', '(https://docs.docker.com/compose/install/)'],
      nginx: ['Ready for start nginx', 'Make sure stop your local nginx with (service nginx stop)'],
    };
    super({ ...data, messages: { ...defaultMessages, ...data.messages } });
  }

  checkDocker({ docker: [minVersion, maxVersion], dockerCompose: [composeMinVersion, composeMaxVersion] }) {
    print.log('******* :whale2: Check Docker versions :whale2: *******');

    this.checkVersion('docker', exec(`docker version --format '{{.Server.Version}}'`), [minVersion, maxVersion]);
    this.checkVersion('docker_compose', exec(`docker-compose version --short`), [composeMinVersion, composeMaxVersion]);
  }
}

module.exports = { EnvironmentChecks };
