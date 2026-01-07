import { useState, useEffect } from 'react';
import { detectNarrativeShifts, checkInvalidations } from '../utils/narrativeIntelligence';

export default function AlertSystem({ content, invalidations = [], onInvalidationsUpdate }) {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    const newAlerts = [];

    // Detect narrative shifts
    const shifts = detectNarrativeShifts(content);
    shifts.forEach(shift => {
      newAlerts.push({
        id: `shift-${shift.theme}`,
        type: 'narrative_shift',
        severity: 'medium',
        title: `Narrative Shift: ${shift.theme}`,
        message: `Sentiment shifted from ${shift.olderSentiment} to ${shift.recentSentiment} (${Math.round(shift.magnitude * 100)}% change)`,
        theme: shift.theme,
        date: new Date(),
      });
    });

    // Check for invalidations
    const newInvalidations = checkInvalidations(content, invalidations);
    newInvalidations.forEach(inv => {
      newAlerts.push({
        id: `invalidation-${inv.contentId}-${inv.invalidatedBy}`,
        type: 'invalidation',
        severity: 'high',
        title: 'Narrative Invalidation Detected',
        message: `Content contradicts existing narrative on theme: ${inv.theme}`,
        theme: inv.theme,
        date: new Date(inv.date),
      });
    });

    setAlerts(newAlerts.filter(alert => !dismissedAlerts.has(alert.id)));
  }, [content, invalidations, dismissedAlerts]);

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[severity] || colors.low;
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No alerts. All narratives are stable.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          {alerts.length} active
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`border-2 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{alert.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-200 text-red-900' :
                    alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                    'bg-blue-200 text-blue-900'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm mb-2">{alert.message}</p>
                <p className="text-xs opacity-75">
                  {alert.date.toLocaleDateString()} {alert.date.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="ml-4 text-gray-600 hover:text-gray-900"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
