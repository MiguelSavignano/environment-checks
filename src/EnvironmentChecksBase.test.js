const { EnvironmentChecksBase } = require('./EnvironmentChecksBase');
const { print } = require('./print');

describe('EnvironmentChecksBase', () => {
  let environmentChecks
  beforeEach(() => {
    environmentChecks = new EnvironmentChecksBase();
  })
  test('#isSuccess', () => {
    expect(environmentChecks.isSuccess()).toEqual(true);
  });
  test('#getMessages', () => {
    environmentChecks = new EnvironmentChecksBase({
      messages: {
        docker: ['Custom Success', 'Custom error'],
      },
    });

    expect(environmentChecks.getMessages('docker')).toEqual({
      failure: 'Custom error',
      success: 'Custom Success',
    });
  });

  describe('#checkVersion', () => {
    let versionRage = ['10.1.0', '11.0.0'];
    test('when version is in the rage', () => {
      const result = environmentChecks.checkVersion('docker', '10.1.1', versionRage);
      expect(result).toEqual(true);
    });

    test('when version is not in the rage', () => {
      const spy = jest.spyOn(print, 'error');
      const result = environmentChecks.checkVersion('docker', '12.1.1', versionRage);

      expect(result).toEqual(false);
      expect(spy).toHaveBeenCalled();
      expect(environmentChecks.errors).toEqual(['docker']);
    });

    test('when version is not defined', () => {
      const spy = jest.spyOn(print, 'error');
      const result = environmentChecks.checkVersion('docker', undefined, versionRage);
      expect(result).toEqual(false);
      expect(spy).toHaveBeenCalled();
    });

    test('when version have custom message', () => {
      let environmentChecks = new EnvironmentChecksBase({
        messages: {
          docker: ['Custom Success', 'Custom error'],
        },
      });

      const spy = jest.spyOn(print, 'error');
      const result = environmentChecks.checkVersion('docker', undefined, versionRage);
      expect(result).toEqual(false);
      expect(spy).toHaveBeenCalledWith(
        `:mega: [Error] Not found version for docker; check your installation of docker Custom error`
      );
      expect(environmentChecks.errors).toEqual(['docker']);
    });
  });

  describe('#checkFile', () => {
    test('when file exists', () => {
      const result = environmentChecks.checkFile('packageJson', './package.json');
      expect(result).toEqual(true);
    });
    test('when file not exists', () => {
      const spy = jest.spyOn(print, 'error');
      const result = environmentChecks.checkFile('packageJson', './package-not-found.json');

      expect(result).toEqual(false);
      expect(spy).toHaveBeenCalled();
      expect(environmentChecks.errors).toEqual(['packageJson']);
    });
  });

  describe('#checkAvailablePort', () => {
    test('when port available', async () => {
      const result = await environmentChecks.checkAvailablePort('nginx', 3000);

      expect(result).toEqual(true);
    });
  });

  describe('#checkFileContains', () => {
    test('when file contains', async () => {
      const result = await environmentChecks.checkFileContains(
        'packageJon',
        './package.json',
        `"main": "index.js"`
      );

      expect(result).toEqual(true);
    });

    test('when file not contains', async () => {
      const result = await environmentChecks.checkFileContains(
        'packageJon',
        './package.json',
        `NOT_EXISTS_CONTENT`
      );

      expect(result).toEqual(false);
    });
  });

});
