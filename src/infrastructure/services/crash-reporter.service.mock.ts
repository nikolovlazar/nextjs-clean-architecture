import { injectable } from 'inversify';

import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

@injectable()
export class MockCrashReporterService implements ICrashReporterService {
  report(_: any): string {
    return 'errorId';
  }
}
