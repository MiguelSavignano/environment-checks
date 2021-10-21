const { EnvironmentChecksBase } = require('./EnvironmentChecksBase');
const { print } = require('./print');

describe('EnvironmentChecksBase', () => {
  let environmentChecks = new EnvironmentChecksBase();
  test('#isSuccess', () => {
    expect(environmentChecks.isSuccess()).toEqual(true);
  });
  describe('#checkVersion', () => {
    test('when version is in the rage', () => {
      const result = environmentChecks.checkVersion('docker', '10.1.1', [
        '10.1.0',
        '11.0.0',
      ]);
      expect(result).toEqual(true);
    });

    test('when version is not in the rage', () => {
      const spy = jest.spyOn(print, 'error');
      const result = environmentChecks.checkVersion('docker', '12.1.1', [
        '10.1.0',
        '11.0.0',
      ]);

      expect(result).toEqual(false);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(environmentChecks.errors).toEqual(['docker']);
    });

    test('when version is not defined', () => {
      const spy = jest.spyOn(print, 'error');
      const result = environmentChecks.checkVersion('docker', undefined, [
        '10.1.0',
        '11.0.0',
      ]);
      expect(result).toEqual(false);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(environmentChecks.errors).toEqual(['docker']);
    });
  });
});
