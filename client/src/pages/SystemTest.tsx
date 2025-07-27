import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function SystemTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: string) => {
    setTestResults(prev => {
      const updated = prev.filter(t => t.name !== name);
      return [...updated, { name, status, message, details }];
    });
  };

  const runSystemTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      // Tests d'authentification
      { name: 'CLIENT Login', endpoint: '/api/client/login', method: 'POST', data: { email: 'client@test.com', password: 'client123' } },
      { name: 'PRO Login', endpoint: '/api/auth/login', method: 'POST', data: { email: 'test@monapp.com', password: 'test1234' } },
      { name: 'CLIENT Register', endpoint: '/api/client/register', method: 'POST', data: { email: 'test' + Date.now() + '@example.com', password: 'test123', firstName: 'Test', lastName: 'User' } },
      
      // Tests de données
      { name: 'Services List', endpoint: '/api/services', method: 'GET' },
      { name: 'Appointments List', endpoint: '/api/appointments', method: 'GET' },
      { name: 'Notifications', endpoint: '/api/notifications/unread', method: 'GET' },
      
      // Tests de réservation
      { name: 'Create Appointment', endpoint: '/api/appointments', method: 'POST', data: {
        userId: 'test-pro-user',
        serviceId: 1,
        clientName: 'Marie Dupont',
        clientEmail: 'client@test.com',
        clientPhone: '06 12 34 56 78',
        appointmentDate: '2025-01-29',
        startTime: '14:00',
        endTime: '15:30',
        notes: 'Test automatique système',
        totalPrice: 45.00,
        depositPaid: 13.50
      }},
      
      // Tests Analytics et Messaging
      { name: 'Analytics Dashboard', endpoint: '/api/analytics/dashboard', method: 'GET' },
      { name: 'Messages List', endpoint: '/api/messages', method: 'GET' },
      { name: 'Stock Alerts', endpoint: '/api/inventory/alerts', method: 'GET' },
    ];

    for (const test of tests) {
      setCurrentTest(test.name);
      
      try {
        const response = await fetch(test.endpoint, {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: test.data ? JSON.stringify(test.data) : undefined,
          credentials: 'include'
        });

        const responseText = await response.text();
        let responseData;
        
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { raw: responseText.substring(0, 100) + '...' };
        }

        if (response.ok) {
          updateTest(test.name, 'success', `${response.status} OK`, JSON.stringify(responseData, null, 2));
        } else {
          updateTest(test.name, 'error', `${response.status} ${response.statusText}`, responseText.substring(0, 200));
        }
      } catch (error) {
        updateTest(test.name, 'error', 'Network Error', error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Petit délai entre les tests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setCurrentTest('');
    setIsRunning(false);
    
    const successCount = testResults.filter(t => t.status === 'success').length;
    const totalCount = tests.length;
    
    toast({
      title: "Tests terminés",
      description: `${successCount}/${totalCount} tests réussis`,
      variant: successCount === totalCount ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Check className="h-4 w-4 text-green-600" />;
      case 'error': return <X className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800 border-green-200">SUCCESS</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800 border-red-200">ERROR</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">WARNING</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-600 border-gray-200">PENDING</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🧪 Tests Système - Salon de Beauté</span>
              <Button
                onClick={runSystemTests}
                disabled={isRunning}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isRunning ? 'Tests en cours...' : 'Lancer les tests'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {testResults.filter(t => t.status === 'success').length}
                </div>
                <div className="text-sm text-green-600">Tests réussis</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {testResults.filter(t => t.status === 'error').length}
                </div>
                <div className="text-sm text-red-600">Tests échoués</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {testResults.length}
                </div>
                <div className="text-sm text-blue-600">Total testé</div>
              </div>
            </div>
            
            {currentTest && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-blue-700 font-medium">Test en cours: {currentTest}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats des tests */}
        <div className="grid gap-4">
          {testResults.map((test, index) => (
            <Card key={index} className="border-l-4 border-l-violet-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                    {getStatusBadge(test.status)}
                  </div>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                
                <div className="text-sm text-gray-700 mb-2">{test.message}</div>
                
                {test.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                      Voir les détails
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {test.details}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {testResults.length === 0 && !isRunning && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                Aucun test lancé pour le moment
              </div>
              <p className="text-sm text-gray-400">
                Cliquez sur "Lancer les tests" pour commencer la validation système
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}