const { EnvironmentChecks, print, exec } = require('../src/index')
const HOME = process.env.WORKDIR_HOME || process.env.HOME;

const messages = {
  dotenv: ['', `You need to create the .env file with the correct values`],
  npm_auth: ['', `You need to login with npm`],
  gcloud_config: ['', `You need to login with gcloud (gcloud auth application-default login)`],
  docker: ['Docker :whale:', '(https://docs.docker.com/get-docker/)'],
  docker_compose: ['Docker compose :whale: :whale:', '(https://docs.docker.com/compose/install/)'],
  nginx: ['Ready for start nginx', 'Make sure stop your local nginx with (service nginx stop)'],
}

async function run() {
  const checks = new EnvironmentChecks({messages, ignoreErrors: []})
  print.platformInfo()

  print.log("******* :whale2: Check Docker versions :whale2: *******")
  checks.checkVersion('docker', exec(`docker version --format '{{.Server.Version}}'`), ['20.10.1']);
  checks.checkVersion('docker_compose', exec(`docker-compose version --short`), ['1.29.2', '2.0.0']);
  print.log("")

  print.log("******* :page_facing_up: Check configuration files :page_facing_up: *******")
  checks.checkFile('dotenv', `.env`);
  checks.checkFile('npm_auth', `${HOME}/.npmrc`);
  checks.checkFile('gcloud_config',
    `${HOME}/.config/gcloud/application_default_credentials.json`,
  );

  print.log("")

  print.log("******* Check Nginx conf *******")
  await checks.checkAvailablePort('nginx', 80)
  print.log("")

  checks.isSuccess()
    ? print.log(`:heavy_check_mark: [Success] Ready :rocket::rocket::rocket:`)
    : print.error(`:x: [Error] Not ready :disappointed:`);
}

run();
