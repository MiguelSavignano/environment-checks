const { EnvironmentChecksBase } = require('./EnvironmentChecksBase')

describe('EnvironmentChecksBase', () => {
  let environmentChecks = new EnvironmentChecksBase()
  test('#isSuccess', () => {
    expect(environmentChecks.isSuccess()).toEqual(true);
  });
});
