// WS-FIX: HealthCheck simple, aucun import métier
// Usage :
// - Depuis la racine : npm run diag:jsx && npm run diag:runtime
// - Depuis /client :
//   - npm run typecheck:client (devrait passer si DOM/React OK)
//   - npm run dev puis ouvrir http://localhost:5173/?health=1 → doit afficher “UI alive”
//   - Retirer ?health=1 → tester l’app réelle. Si page blanche, regarder la console (ErrorBoundary + [WS-FIX onerror]).

export default function HealthCheckPage() {
  return (
    <div data-health="ok" style={{padding:32, fontSize:18}}>
      UI alive<br />
      {new Date().toISOString()}
    </div>
  );
}
