export const VITAL_SIGNS_THRESHOLDS = {
  heartRate: {
    critical: { low: 40, high: 130 },
    warning: { low: 50, high: 120 },
    normal: { low: 60, high: 100 },
    unit: 'bpm'
  },
  bloodPressure: {
    systolic: {
      critical: { low: 80, high: 180 },
      warning: { low: 90, high: 160 },
      normal: { low: 100, high: 140 },
    },
    diastolic: {
      critical: { low: 50, high: 110 },
      warning: { low: 60, high: 100 },
      normal: { low: 70, high: 90 },
    },
    unit: 'mmHg'
  },
  temperature: {
    critical: { low: 35, high: 40 },
    warning: { low: 35.5, high: 39 },
    normal: { low: 36.1, high: 37.8 },
    unit: '°C'
  },
  oxygenLevel: {
    critical: { low: 85, high: 100 },
    warning: { low: 90, high: 100 },
    normal: { low: 95, high: 100 },
    unit: '%'
  },
  respiratoryRate: {
    critical: { low: 8, high: 30 },
    warning: { low: 10, high: 25 },
    normal: { low: 12, high: 20 },
    unit: '/min'
  }
};