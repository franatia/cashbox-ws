import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { traceStorage } from '../logging/trace-storage';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private slowDetector = new Logger('SLOW-DETECTOR');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    // 1. Correlation ID: Extract from incoming headers or generate a new UUID
    const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();
    res.setHeader('x-correlation-id', correlationId);

    // 2. Safely decode user email for logging identity context
    let userEmail = 'Anonymous';
    const authHeader = req.headers['authorization'] || req.headers['x-refresh-token'];
    if (authHeader) {
      try {
        const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        const jwtString = token.startsWith('Bearer ') ? token.substring(7) : token;
        const payloadBase64 = jwtString.split('.')[1];
        if (payloadBase64) {
          const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
          userEmail = payload.email || payload.userId || 'User';
        }
      } catch (e) {
        // Safe catch
      }
    }

    const context = { correlationId, userEmail };

    // 3. Bind request scope to AsyncLocalStorage context
    traceStorage.run(context, () => {
      res.on('finish', () => {
        const { statusCode } = res;
        const duration = Date.now() - startTime;

        // Color coding constants for methods
        let methodColor = '\x1b[32m'; // Green
        if (method === 'POST') methodColor = '\x1b[33m'; // Yellow
        if (method === 'PUT' || method === 'PATCH') methodColor = '\x1b[34m'; // Blue
        if (method === 'DELETE') methodColor = '\x1b[31m'; // Red

        // Color coding constants for statuses
        let statusColor = '\x1b[32m'; // Green
        if (statusCode >= 400 && statusCode < 500) statusColor = '\x1b[33m'; // Yellow/Orange
        if (statusCode >= 500) statusColor = '\x1b[31m'; // Red

        const resetColor = '\x1b[0m';

        // Base colorful request log
        const logMsg = `${methodColor}${method}${resetColor} ${originalUrl} ${statusColor}${statusCode}${resetColor} - ${duration}ms - ${userEmail} (${ip}) \x1b[90m[Trace: ${correlationId}]\x1b[0m`;

        // Output request log
        if (statusCode >= 500) {
          this.logger.error(logMsg);
        } else if (statusCode >= 400) {
          this.logger.warn(logMsg);
        } else {
          this.logger.log(logMsg);
        }

        // 4. Slow Request Detector (Threshold Warnings)
        if (duration > 1000) {
          this.slowDetector.error(
            `\x1b[31mCRITICAL\x1b[0m - ${method} ${originalUrl} took ${duration}ms! (Breached Error Threshold > 1000ms) [Trace: ${correlationId}]`
          );
        } else if (duration > 300) {
          this.slowDetector.warn(
            `\x1b[33mWARNING\x1b[0m - ${method} ${originalUrl} took ${duration}ms. (Breached Warning Threshold > 300ms) [Trace: ${correlationId}]`
          );
        }
      });

      next();
    });
  }
}
