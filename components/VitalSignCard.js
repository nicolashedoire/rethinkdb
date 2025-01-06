import { VITAL_SIGNS_THRESHOLDS } from '../utils/constants';

function getStatusColorForSingleValue(value, thresholds) {
  if (!thresholds || typeof value !== 'number') {
    return 'bg-gray-100 text-gray-800 border-gray-300';
  }

  if (value <= thresholds.critical.low || value >= thresholds.critical.high) {
    return 'bg-red-100 text-red-800 border-red-300';
  } else if (value <= thresholds.warning.low || value >= thresholds.warning.high) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }
  return 'bg-green-100 text-green-800 border-green-300';
}

function getStatusColor(value, type) {
  if (!type || !VITAL_SIGNS_THRESHOLDS[type]) {
    return 'bg-gray-100 text-gray-800 border-gray-300';
  }

  if (type === 'bloodPressure' && typeof value === 'string') {
    const [systolic, diastolic] = value.split('/').map(Number);
    
    const systolicStatus = getStatusColorForSingleValue(systolic, VITAL_SIGNS_THRESHOLDS.bloodPressure.systolic);
    const diastolicStatus = getStatusColorForSingleValue(diastolic, VITAL_SIGNS_THRESHOLDS.bloodPressure.diastolic);
    
    if (systolicStatus.includes('red') || diastolicStatus.includes('red')) {
      return 'bg-red-100 text-red-800 border-red-300';
    } else if (systolicStatus.includes('yellow') || diastolicStatus.includes('yellow')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    return 'bg-green-100 text-green-800 border-green-300';
  }

  return getStatusColorForSingleValue(value, VITAL_SIGNS_THRESHOLDS[type]);
}

export default function VitalSignCard({ title, value, type, icon, trend = 0 }) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl">{value}</p>
        </div>
        <div className="rounded-full p-2">
          {icon}
        </div>
      </div>
    </div>
  );
}