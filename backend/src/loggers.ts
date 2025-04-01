import { Injectable, ConsoleLogger, LogLevel } from '@nestjs/common';

type LogObject = {
  level: LogLevel;
  pid: number;
  timestamp: number;
  message: unknown;
  context?: string;
};

class FormattedLogger extends ConsoleLogger {
  protected prepareMessage(logObject: LogObject) {
    return String(logObject.message);
  }

  protected printMessages(
    messages: unknown[],
    context = '',
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr'
  ) {
    messages.forEach(message => {
      this.printFormattedMessage(message, {
        context,
        logLevel,
        writeStreamType
      });
      return;
    });
  }

  protected printFormattedMessage(
    message: unknown,
    options: {
      context: string;
      logLevel: LogLevel;
      writeStreamType?: 'stdout' | 'stderr';
    }
  ) {
    const logObject: LogObject = {
      level: options.logLevel,
      pid: process.pid,
      timestamp: Date.now(),
      message
    };

    if (options.context) {
      logObject.context = options.context;
    }

    const formattedMessage = this.prepareMessage(logObject);
    process[options.writeStreamType ?? 'stdout'].write(`${formattedMessage}\n`);
  }
}

@Injectable()
export class DevLogger extends ConsoleLogger {}

@Injectable()
export class JsonLogger extends FormattedLogger {
  protected prepareMessage(logObject: LogObject) {
    return JSON.stringify(logObject);
  }
}

@Injectable()
export class TskvLogger extends FormattedLogger {
  protected prepareMessage(logObject: LogObject) {
    return (
      'level=' +
      String(logObject.level) +
      '\t' +
      'pid=' +
      String(logObject.pid) +
      '\t' +
      'timestamp=' +
      String(logObject.timestamp) +
      '\t' +
      'message=' +
      String(logObject.message) +
      (logObject.context ? '\t' + 'context=' + logObject.context : '')
    );
  }
}
