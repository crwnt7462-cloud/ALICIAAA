import { useLocation } from 'wouter';

export default function TestSalon() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white">
      <h1 className="text-5xl font-bold mb-8">TEST PAGE SALON</h1>
      <p className="text-xl mb-4">✅ La route /salon fonctionne !</p>
      <p className="text-lg mb-4">Current location: {location}</p>
      <p className="text-lg">Si vous voyez cette page, le routing marche parfaitement.</p>
      
      <div className="mt-12 bg-black/20 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Prochaines étapes :</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>✅ Route /salon configurée</li>
          <li>✅ ModernSalonMobileFixed prêt</li>
          <li>🔄 Affichage du template complet</li>
        </ul>
      </div>
    </div>
  );
}