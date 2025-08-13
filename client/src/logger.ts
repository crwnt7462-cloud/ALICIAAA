/**
 * Logger centralisé pour l'application
 * Remplace tous les console.log dispersés
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;

  constructor() {
    // En développement, activer tous les logs
    if (import.meta.env.DEV) {
      this.level = LogLevel.DEBUG;
    }
  }

  private formatMessage(level: string, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] ${level}: ${message}`;
    
    if (data !== undefined) {
      return `${baseMessage} ${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  error(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, data));
    }
  }

  // Logs spécifiques pour la navigation
  nav(from: string, to: string, reason: string, metadata?: Record<string, unknown>): void {
    const navData = {
      from,
      to,
      reason,
      timestamp: new Date().toISOString(),
      ...metadata,
    };
    this.info(`[NAV] ${from} → ${to} (${reason})`, navData);
  }

  // Logs pour les requêtes API
  apiRequest(method: string, url: string, params?: unknown): void {
    this.debug(`[API] ${method} ${url}`, params);
  }

  apiResponse(method: string, url: string, status: number, duration?: number): void {
    const metadata = { method, url, status, duration };
    if (status >= 400) {
      this.warn(`[API] Request failed`, metadata);
    } else {
      this.debug(`[API] Request successful`, metadata);
    }
  }

  // Logs pour les erreurs de booking
  bookingError(step: string, error: string, context?: Record<string, unknown>): void {
    this.error(`[BOOKING] Error in ${step}: ${error}`, context);
  }

  // Logs pour le cycle de vie des composants
  componentMount(componentName: string, props?: Record<string, unknown>): void {
    this.debug(`[COMPONENT] ${componentName} mounted`, props);
  }

  componentUnmount(componentName: string): void {
    this.debug(`[COMPONENT] ${componentName} unmounted`);
  }

  // Méthode pour changer le niveau de log
  setLevel(level: LogLevel): void {
    this.level = level;
    this.info(`Logger level set to ${LogLevel[level]}`);
  }
}

// Instance singleton du logger
export const logger = new Logger();

// Export des méthodes pour utilisation directe
export const {
  debug,
  info,
  warn,
  error,
  nav,
  apiRequest,
  apiResponse,
  bookingError,
  componentMount,
  componentUnmount,
} = logger;

// Hook personnalisé pour les composants React
export function useLogger(componentName: string) {
  return {
    debug: (message: string, data?: unknown) => logger.debug(`[${componentName}] ${message}`, data),
    info: (message: string, data?: unknown) => logger.info(`[${componentName}] ${message}`, data),
    warn: (message: string, data?: unknown) => logger.warn(`[${componentName}] ${message}`, data),
    error: (message: string, data?: unknown) => logger.error(`[${componentName}] ${message}`, data),
    mount: (props?: Record<string, unknown>) => logger.componentMount(componentName, props),
    unmount: () => logger.componentUnmount(componentName),
  };
}