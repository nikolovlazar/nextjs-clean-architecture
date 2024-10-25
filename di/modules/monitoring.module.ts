import { ContainerModule, interfaces } from 'inversify';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { MockInstrumentationService } from '@/src/infrastructure/services/instrumentation.service.mock';
import { MockCrashReporterService } from '@/src/infrastructure/services/crash-reporter.service.mock';
import { InstrumentationService } from '@/src/infrastructure/services/instrumentation.service';
import { CrashReporterService } from '@/src/infrastructure/services/crash-reporter.service';

import { DI_SYMBOLS } from '../types';

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === 'test') {
    bind<IInstrumentationService>(DI_SYMBOLS.IInstrumentationService).to(
      MockInstrumentationService
    );
    bind<ICrashReporterService>(DI_SYMBOLS.ICrashReporterService).to(
      MockCrashReporterService
    );
  } else {
    bind<IInstrumentationService>(DI_SYMBOLS.IInstrumentationService).to(
      InstrumentationService
    );
    bind<ICrashReporterService>(DI_SYMBOLS.ICrashReporterService).to(
      CrashReporterService
    );
  }
};

export const MonitoringModule = new ContainerModule(initializeModule);
