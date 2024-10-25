import { injectable } from 'inversify';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

@injectable()
export class MockInstrumentationService implements IInstrumentationService {
  startSpan<T>(
    _: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T {
    return callback();
  }
}
