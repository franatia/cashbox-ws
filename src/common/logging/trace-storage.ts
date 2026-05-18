import { AsyncLocalStorage } from 'async_hooks';

export interface TraceContext {
  correlationId: string;
  userEmail?: string;
}

export const traceStorage = new AsyncLocalStorage<TraceContext>();
