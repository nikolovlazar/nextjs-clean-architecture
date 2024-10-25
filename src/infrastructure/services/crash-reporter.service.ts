import { injectable } from 'inversify';
import * as Sentry from '@sentry/nextjs';

import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

@injectable()
export class CrashReporterService implements ICrashReporterService {
  report(error: Error): string {
    return Sentry.captureException(error);
  }
}
