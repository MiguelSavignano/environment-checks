### EnvironmentChecks

Check your environment

Docker versions

```js
const { EnvironmentChecks, print } = require('environment-checks');

async function run() {
  const checks = new EnvironmentChecks();
  print.platformInfo();
  checks.checkDocker({
    docker: ['20.10.1'],
    dockerCompose: ['1.29.2', '2.0.0'],
  });
  checks.isSuccess()
    ? print.log(`:heavy_check_mark: [Success] Ready :rocket::rocket::rocket:`)
    : print.error(`:x: [Error] Not ready :disappointed:`);
}

run();
```
