import { Logger } from './logger.service';
import { ConfigService } from '@nestjs/config';
import { anything, instance, mock, when } from 'ts-mockito';
import { ConsoleMock } from '../utils/tests/mock-console';
import * as MockDate from 'mockdate';
import { LogLevel } from './log.levels';

describe('LoggerService', () => {
  let logger: Logger;
  let configuration: ConfigService;

  const year = '2021';
  const month = '05';
  const day = '12';
  const hour = '09';
  const minutes = '20';
  const seconds = '12';
  const milliseconds = '087';

  beforeEach(async () => {
    // Setting the date this way because I want full control of it and access to
    // parts of the date for future assertions.
    MockDate.set(
      new Date(
        `${year}-${month}-${day} ${hour}:${minutes}:${seconds}.${milliseconds}`,
      ),
    );
    ConsoleMock.mock();
    configuration = mock(ConfigService);

    logger = new Logger(instance(configuration));
  });

  afterEach(() => {
    MockDate.reset();
    ConsoleMock.restore();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it(`displays the date when the log was produced`, () => {
    logger.log('a log');

    expect(ConsoleMock.lastCall()).toContain(`${year}-${month}-${day}`);
  });

  it(`displays the time, with milliseconds, when the log was produced`, () => {
    logger.log('a log');

    expect(ConsoleMock.lastCall()).toContain(
      `${hour}:${minutes}:${seconds}.${milliseconds}`,
    );
  });

  it(`displays the timezone of the server when the log was produced`, () => {
    logger.log('a log');

    /**
     * @todo: We should get this dynamically, but I don't want to load a whole
     * date library just for this specific scenario and JS does not offer an
     * easy way to get this value in this specific format.
     */
    expect(ConsoleMock.lastCall()).toContain('-0400');
  });

  it(`logs the logger's global context`, () => {
    logger.setContext('TestContext');
    logger.log('a log');

    expect(ConsoleMock.lastCall()).toContain('[TestContext]');
  });

  it(`logs the log message context`, () => {
    logger.log('a log', 'LocalContext');

    expect(ConsoleMock.lastCall()).toContain('[LocalContext]');
  });

  it(`prefers the log message's context over the global logger's context`, () => {
    logger.setContext('TestContext');
    logger.log('a log', 'LocalContext');

    expect(ConsoleMock.lastCall()).toContain('[LocalContext]');
  });

  it(`does not display logs below the log level`, () => {
    when(configuration.get<string>(anything(), anything())).thenReturn(
      LogLevel.ERROR,
    );
    logger = new Logger(instance(configuration));

    logger.verbose('dont display me');

    expect(ConsoleMock.lastCall()).toBeUndefined();
  });

  describe(`when logging an error`, () => {
    it(`displays the context`, () => {
      logger.error('a log', '', 'TestContext');

      expect(ConsoleMock.lastCall()).toContain('[TestContext]');
    });
  });

  describe(`when logging an debug message`, () => {
    it(`displays the context`, () => {
      logger.debug('a log', 'TestContext');

      expect(ConsoleMock.lastCall()).toContain('[TestContext]');
    });
  });

  describe(`when logging a verbose message`, () => {
    it(`displays the context`, () => {
      logger.verbose('a log', 'TestContext');

      expect(ConsoleMock.lastCall()).toContain('[TestContext]');
    });
  });

  describe(`when logging a warning message`, () => {
    it(`displays the context`, () => {
      logger.warn('a log', 'TestContext');

      expect(ConsoleMock.lastCall()).toContain('[TestContext]');
    });
  });

  describe(`when the logger has no context`, () => {
    it(`does not try to display the context`, () => {
      logger.log('a log');

      expect(ConsoleMock.lastCall()).not.toMatch(/\[*.]/);
    });
  });
});
