export interface ICrashReporterService {
  report(error: Error): string;
}
