/**
 * ErrorBoundary global pour capturer les erreurs React
 * Affiche un toast non bloquant en cas d'erreur runtime
 */

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { logger } from '@/logger';
import { toast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Met à jour le state pour afficher l'UI de fallback au prochain rendu
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log l'erreur avec le contexte complet
    logger.error('React Error Boundary caught an error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    // Afficher un toast non bloquant
    toast({
      title: "Erreur inattendue",
      description: "Une erreur s'est produite. L'équipe technique a été notifiée.",
      variant: "destructive",
    });

    // En développement, on peut aussi envoyer l'erreur à un service de monitoring
    if (import.meta.env.DEV) {
      console.group('🔥 ErrorBoundary - Erreur React');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
    
    // Recharger la page si l'erreur persiste
    setTimeout(() => {
      if (this.state.hasError) {
        window.location.reload();
      }
    }, 100);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Interface de fallback par défaut
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Oups ! Une erreur s'est produite
              </h2>
              <p className="text-gray-600 mb-6">
                Nous avons rencontré un problème inattendu. 
                L'équipe technique a été automatiquement notifiée.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Réessayer
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Détails techniques (développement uniquement)
                </summary>
                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto text-red-600">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour utiliser l'ErrorBoundary dans les composants fonctionnels
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    // Simuler componentDidCatch
    logger.error('Manual error reported', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Erreur",
      description: error.message || "Une erreur inattendue s'est produite",
      variant: "destructive",
    });
  };
}