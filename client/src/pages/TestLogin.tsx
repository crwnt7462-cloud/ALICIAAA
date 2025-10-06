import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Appointment {
  clientName: string;
  date: string;
  time: string;
  service: string;
}

export default function TestLogin() {
  const [message, setMessage] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const connectWithData = async () => {
    try {
      setMessage('🔑 Connexion en cours...');
      
      // Connexion avec le compte qui a les données
      const loginResponse = await fetch('/api/login-with-data', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const loginData = await loginResponse.json();
      
      if (loginData.success) {
        setMessage(`✅ Connecté: ${loginData.user.salonName}`);
        
        // Récupération des rendez-vous
        const appointmentsResponse = await fetch('/api/appointments', {
          credentials: 'include'
        });
        
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          setAppointments(appointmentsData);
          setMessage(`✅ Connecté avec ${appointmentsData.length} rendez-vous !`);
        } else {
          setMessage('❌ Erreur récupération rendez-vous');
        }
      } else {
        setMessage('❌ Erreur connexion');
      }
    } catch (error) {
      setMessage('❌ Erreur: ' + (error as Error).message);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧪 Test Connexion</h1>
      
      <Button 
        onClick={connectWithData}
        className="w-full mb-4"
      >
        Se connecter avec les données
      </Button>
      
      <div className="bg-gray-100 p-4 rounded">
        <p className="font-mono text-sm">{message}</p>
      </div>
      
      {appointments.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Rendez-vous:</h3>
          {appointments.map((apt, i) => (
            <div key={i} className="p-2 border rounded mt-2">
              <p><strong>{apt.clientName}</strong></p>
              <p>{apt.date} à {apt.time}</p>
              <p>{apt.service}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}