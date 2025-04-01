import { DevLogger, JsonLogger, TskvLogger } from './loggers';

describe('Loggers Output Format', () => {
  it('DevLogger', () => {
    const logSpy = jest.spyOn(process['stdout'], 'write');
    const logger = new DevLogger();
    const message = 'Message';
    logger.log(message);
    const expectedMessage = 'LOG' + String.fromCharCode(27, 91, 51, 57, 109, 32, 27, 91, 51, 50, 109) + message;
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(expectedMessage));
    logSpy.mockRestore();
  });

  it('JsonLogger', () => {
    const logSpy = jest.spyOn(process['stdout'], 'write');
    const logger = new JsonLogger();
    const message = 'Message';
    logger.log(message);
    const expectedMessage1 = '"level":"log","pid":';
    const expectedMessage2 = ',"message":"' + message + '"';
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(expectedMessage1));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(expectedMessage2));
    logSpy.mockRestore();
  });

  it('TskvLogger', () => {
    const logSpy = jest.spyOn(process['stdout'], 'write');
    const logger = new TskvLogger();
    const message = 'Message';
    logger.log(message);
    const expectedMessage1 = 'level=log\tpid=';
    const expectedMessage2 = '\tmessage=' + message;
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(expectedMessage1));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(expectedMessage2));
    logSpy.mockRestore();
  });
});
