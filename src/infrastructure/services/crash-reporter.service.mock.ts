import { injectable } from 'inversify';

import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

@injectable()
export class MockCrashReporterService implements ICrashReporterService {
  report(_: Error): string {
    return 'errorId';
  }
}
