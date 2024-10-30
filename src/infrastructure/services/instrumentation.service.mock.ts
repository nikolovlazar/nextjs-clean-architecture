import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class MockInstrumentationService implements IInstrumentationService {
  startSpan<T>(
    _: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T {
    return callback();
  }

  async instrumentServerAction<T>(
    _: string,
    __: Record<string, any>,
    callback: () => T
  ): Promise<T> {
    return callback();
  }
}
