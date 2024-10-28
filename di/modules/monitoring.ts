import { Container } from '@evyweb/ioctopus';

import { MockInstrumentationService } from '@/src/infrastructure/services/instrumentation.service.mock';
import { InstrumentationService } from '@/src/infrastructure/services/instrumentation.service';
import { MockCrashReporterService } from '@/src/infrastructure/services/crash-reporter.service.mock';
import { CrashReporterService } from '@/src/infrastructure/services/crash-reporter.service';

import { DI } from '@/di/container';

export function registerMonitoringModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container
      .bind(DI.IInstrumentationService)
      .toClass(MockInstrumentationService);
    container.bind(DI.ICrashReporterService).toClass(MockCrashReporterService);
  } else {
    container.bind(DI.IInstrumentationService).toClass(InstrumentationService);
    container.bind(DI.ICrashReporterService).toClass(CrashReporterService);
  }
}
