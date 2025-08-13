type Props = { onRetry?: () => void; message?: string };
export function RetryPanel({ onRetry, message }: Props) {
  return (
    <div style={{ maxWidth: 520, margin: '48px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,.08)', textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Oups ! Une erreur s'est produite</div>
      <p style={{ color: '#444', marginBottom: 16 }}>
        {message ?? "Nous avons rencontré un problème inattendu. L'équipe technique a été notifiée."}
      </p>
      <button onClick={onRetry} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6c4df6', color: '#fff', cursor: 'pointer' }}>
        Réessayer
      </button>
    </div>
  );
}