import { useLocation } from 'wouter';

export default function TestSalon() {
  const [location] = useLocation();

  console.log("TestSalon component is LOADING");
  console.log("Current location in TestSalon:", location);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-8 text-white">
      <h1 className="text-6xl font-bold mb-8">🚀 TEST SALON ROUTE</h1>
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
        <p className="text-3xl mb-4">✅ SUCCÈS : La route /salon fonctionne !</p>
        <p className="text-2xl mb-4">📍 Location actuelle: {location}</p>
        <p className="text-xl">🎯 Le component TestSalon s'affiche correctement</p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-4">Prochaines étapes :</h2>
        <ul className="space-y-3 text-xl">
          <li className="flex items-center gap-3">
            <span className="text-green-300">✅</span> 
            Route /salon configurée et active
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-300">✅</span> 
            ModernSalonMobileFixed template prêt
          </li>
          <li className="flex items-center gap-3">
            <span className="text-yellow-300">🔄</span> 
            Remplacement par le vrai template salon
          </li>
        </ul>
      </div>
    </div>
  );
}