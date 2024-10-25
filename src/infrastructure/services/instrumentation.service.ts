import { injectable } from 'inversify';
import * as Sentry from '@sentry/nextjs';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

@injectable()
export class InstrumentationService implements IInstrumentationService {
  startSpan<T>(
    options: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T {
    return Sentry.startSpan(options, callback);
  }
}
