import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainLogger } from './domain-logger';
import { traceStorage } from './trace-storage';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new DomainLogger('EXCEPTION');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const store = traceStorage.getStore();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const traceId = store?.correlationId || 'N/A';

    // Format final message to return
    let message = rawMessage;
    if (typeof rawMessage === 'object' && rawMessage !== null) {
      message = (rawMessage as any).message || rawMessage;
    }

    // Log detail based on severity
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}: ${
          exception instanceof Error ? exception.message : exception
        }`,
        exception instanceof Error ? exception.stack : undefined
      );
    } else {
      this.logger.warn(
        `Http exception on ${request.method} ${request.url} - Status ${status} - Details: ${JSON.stringify(
          rawMessage
        )}`
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      traceId,
      message,
    });
  }
}
