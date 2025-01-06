import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Heart, Thermometer, Gauge, Activity, Wind } from 'lucide-react';
import VitalSignCard from '../components/VitalSignCard';

export default function Home() {
  const [metricsData, setMetricsData] = useState([]);
  const [error, setError] = useState(null);
  const [lastVitalSigns, setLastVitalSigns] = useState(null);
  const [trends, setTrends] = useState({});
  const chartRef = useRef(null);

  // Calcul des tendances
  const calculateTrends = useCallback((newData, oldData) => {
    if (!oldData) return {};
    try {
      return {
        heartRate: ((newData.heartRate || 0) - (oldData.heartRate || 0)),
        oxygenLevel: ((newData.oxygenLevel || 0) - (oldData.oxygenLevel || 0)),
        temperature: ((newData.temperature || 0) - (oldData.temperature || 0)),
        respiratoryRate: ((newData.respiratoryRate || 0) - (oldData.respiratoryRate || 0))
      };
    } catch (error) {
      console.error('Error calculating trends:', error);
      return {};
    }
  }, []);

  // Mise à jour des données
  const updateData = useCallback((newData) => {
    setMetricsData(prevData => {
      const updatedData = [...prevData, newData].slice(-20);
      if (chartRef.current) {
        chartRef.current.props.data = updatedData;
      }
      return updatedData;
    });
  }, []);

  // Connexion SSE
  const connectToSSE = useCallback(() => {
    const eventSource = new EventSource('/api/metrics');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const timestamp = new Date(data.timestamp).toLocaleTimeString();
        
        // Extraction des signes vitaux, soit directement, soit depuis vital_signs
        const vitalSigns = {
          heartRate: data.heartRate || (data.vital_signs && data.vital_signs.heartRate) || 0,
          bloodPressure: data.bloodPressure || (data.vital_signs && data.vital_signs.bloodPressure) || { systolic: 0, diastolic: 0 },
          temperature: data.temperature || (data.vital_signs && data.vital_signs.temperature) || 0,
          oxygenLevel: data.oxygenLevel || (data.vital_signs && data.vital_signs.oxygenLevel) || 0,
          respiratoryRate: data.respiratoryRate || (data.vital_signs && data.vital_signs.respiratoryRate) || 0
        };
        
        setLastVitalSigns(prevSigns => {
          const trends = calculateTrends(vitalSigns, prevSigns);
          setTrends(trends);
          return vitalSigns;
        });
        
        updateData({
          timestamp,
          ...vitalSigns
        });
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setError('Connection perdue. Tentative de reconnexion...');
      eventSource.close();
      setTimeout(connectToSSE, 5000);
    };

    return eventSource;
  }, [updateData, calculateTrends]);

  useEffect(() => {
    const eventSource = connectToSSE();
    return () => {
      eventSource.close();
    };
  }, [connectToSSE]);

  if (error) return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
    </div>
  );

  if (!lastVitalSigns) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg text-gray-600">Chargement des signes vitaux...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Monitoring Patient</h1>
          <p className="text-gray-500">Surveillance des signes vitaux en temps réel</p>
        </header>

        {/* Grille des signes vitaux */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <VitalSignCard
            title="Fréquence Cardiaque"
            value={lastVitalSigns.heartRate}
            type="heartRate"
            trend={trends.heartRate}
            icon={<Heart className="h-6 w-6" />}
          />
          
          <VitalSignCard
            title="Tension Artérielle"
            value={`${lastVitalSigns.bloodPressure.systolic.toFixed(0)}/${lastVitalSigns.bloodPressure.diastolic.toFixed(0)}`}
            type="bloodPressure"
            icon={<Activity className="h-6 w-6" />}
          />
          
          <VitalSignCard
            title="Température"
            value={lastVitalSigns.temperature}
            type="temperature"
            trend={trends.temperature}
            icon={<Thermometer className="h-6 w-6" />}
          />
          
          <VitalSignCard
            title="Saturation O2"
            value={lastVitalSigns.oxygenLevel}
            type="oxygenLevel"
            trend={trends.oxygenLevel}
            icon={<Gauge className="h-6 w-6" />} 
          />
          
          <VitalSignCard
            title="Fréq. Respiratoire"
            value={lastVitalSigns.respiratoryRate}
            type="respiratoryRate"
            trend={trends.respiratoryRate}
            icon={<Wind className="h-6 w-6" />}
          />
        </div>

        {/* Graphique */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Évolution des paramètres</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={metricsData} ref={chartRef}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                name="Fréq. Cardiaque"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="oxygenLevel" 
                stroke="#3b82f6" 
                name="Saturation O2"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#22c55e" 
                name="Température"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}