import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log(exception);

    let message = exception.message;
    if (exception.response != undefined) message = exception.response?.message;
    if (Array.isArray(message)) message = message[0];

    response.status(exception.status || 500).send({ error: message });
  }
}
