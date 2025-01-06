import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [metricsData, setMetricsData] = useState([]);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  const updateData = useCallback((newData) => {
    setMetricsData(prevData => {
      const updatedData = [...prevData, newData].slice(-20);
      
      // Mettre à jour le graphique sans le redessiner complètement
      if (chartRef.current) {
        chartRef.current.props.data = updatedData;
      }
      
      return updatedData;
    });
  }, []);

  const connectToSSE = useCallback(() => {
    const eventSource = new EventSource('/api/metrics');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        updateData({
          timestamp: new Date(data.timestamp).toLocaleTimeString(),
          value: data.metric_value
        });
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setError('Connection lost. Retrying...');
      eventSource.close();
      setTimeout(connectToSSE, 5000);
    };

    return eventSource;
  }, [updateData]);

  useEffect(() => {
    const eventSource = connectToSSE();
    return () => {
      eventSource.close();
    };
  }, [connectToSSE]);

  if (error) return <div>{error}</div>;
  if (metricsData.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h1>Métriques en temps réel</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={metricsData}
          ref={chartRef}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="linear" 
            dataKey="value" 
            stroke="#8884d8" 
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {metricsData.length > 0 && (
        <div>
          <p>Dernière valeur: {metricsData[metricsData.length - 1].value.toFixed(2)}</p>
          <p>Timestamp: {metricsData[metricsData.length - 1].timestamp}</p>
        </div>
      )}
    </div>
  );
}