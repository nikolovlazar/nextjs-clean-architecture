export interface ICrashReporterService {
  report(error: any): string;
}
