import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 520, margin: '48px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Oups ! Une erreur s'est produite</div>
          <p style={{ color: '#444', marginBottom: 16 }}>
            Nous avons rencontré un problème inattendu. Réessaie.
          </p>
          <button onClick={() => location.reload()} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6c4df6', color: '#fff', cursor: 'pointer' }}>
            Réessayer
          </button>
          <details style={{ marginTop: 12, color: '#666' }}>
            <summary>Détails techniques (développement uniquement)</summary>
            <pre style={{ textAlign: 'left', overflowX: 'auto' }}>{String(this.state.error?.stack ?? this.state.error ?? '')}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}