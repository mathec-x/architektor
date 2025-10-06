import { LoggerAdapter } from '@/adapters/logger/LoggerAdapter';

export class LoggerService extends LoggerAdapter {
  protected levels = {
    'VERBOSE': 'grey',
    'DEBUG': 'debug',
    'INFO': 'info',
    'WARN': 'warn',
    'HTTP': 'http',
    'ERROR': 'error',
    'ALERT': 'alert',
    'CRITICAL': 'red'
  };

  isVerboseEnabled() {
    return this.isEnabled('VERBOSE');
  }
  isDebugEnabled() {
    return this.isEnabled('DEBUG');
  }
  isInfoEnabled() {
    return this.isEnabled('INFO');
  }
  isWarnEnabled() {
    return this.isEnabled('WARN');
  }
  isHttpEnabled() {
    return this.isEnabled('HTTP');
  }
  isErrorEnabled() {
    return this.isEnabled('ERROR');
  }
  isAlertEnabled() {
    return this.isEnabled('ALERT');
  }
  isCriticalEnabled() {
    return this.isEnabled('CRITICAL');
  }

  verbose(message: string, ...optionalParams: any[]) {
    if (!this.isVerboseEnabled()) return;
    const data = this.formatMessage('VERBOSE', message, optionalParams);
    this.doprint(data);
  }
  debug(message: string, ...optionalParams: any[]) {
    if (!this.isDebugEnabled()) return;
    const data = this.formatMessage('DEBUG', message, optionalParams);
    this.doprint(data);
  }
  info(message: string, ...optionalParams: any[]) {
    if (!this.isInfoEnabled()) return;
    const data = this.formatMessage('INFO', message, optionalParams);
    this.doprint(data);
  }
  warn(message: string, ...optionalParams: any[]) {
    if (!this.isWarnEnabled()) return;
    const data = this.formatMessage('WARN', message, optionalParams);
    this.doprint(data);
  }
  http(message: string, ...optionalParams: any[]) {
    if (!this.isHttpEnabled()) return;
    const data = this.formatMessage('HTTP', message, optionalParams);
    this.doprint(data);
  }
  error(message: string, ...optionalParams: any[]) {
    if (!this.isErrorEnabled()) return;
    const data = this.formatMessage('ERROR', message, optionalParams);
    this.doprint(data);
  }
  alert(message: string, ...optionalParams: any[]) {
    if (!this.isAlertEnabled()) return;
    const data = this.formatMessage('ALERT', message, optionalParams);
    this.doprint(data);
  }
  critical(message: string, ...optionalParams: any[]) {
    if (!this.isCriticalEnabled()) return;
    const data = this.formatMessage('CRITICAL', message, optionalParams);
    this.doprint(data);
  }
}