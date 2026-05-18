import { Logger } from '@nestjs/common';
import { traceStorage } from './trace-storage';

export class DomainLogger {
  constructor(private readonly domain: string) {}

  private format(msg: string) {
    const store = traceStorage.getStore();
    const traceId = store?.correlationId ? ` \x1b[90m[TraceId: ${store.correlationId}]\x1b[0m` : '';
    const user = store?.userEmail && store.userEmail !== 'Anonymous' ? ` \x1b[90m[User: ${store.userEmail}]\x1b[0m` : '';
    return `[\x1b[35m${this.domain}\x1b[0m]${traceId}${user} ${msg}`;
  }

  log(msg: string) {
    Logger.log(this.format(msg));
  }

  warn(msg: string) {
    Logger.warn(this.format(msg));
  }

  error(msg: string, trace?: string) {
    Logger.error(this.format(msg), trace);
  }

  debug(msg: string) {
    Logger.debug(this.format(msg));
  }
}
