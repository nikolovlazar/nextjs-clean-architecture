export interface IInstrumentationService {
  startSpan<T>(
    options: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T;
}
