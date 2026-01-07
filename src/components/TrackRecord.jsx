import { useState } from 'react';

export default function TrackRecord({ content, onUpdate }) {
  const [trackRecords, setTrackRecords] = useState(() => {
    const stored = localStorage.getItem('makro_track_records');
    return stored ? JSON.parse(stored) : {};
  });

  const updateTrackRecord = (contentId, outcome) => {
    const newRecords = {
      ...trackRecords,
      [contentId]: {
        outcome, // 'correct', 'incorrect', 'partial', 'pending'
        updatedAt: Date.now(),
      },
    };
    setTrackRecords(newRecords);
    localStorage.setItem('makro_track_records', JSON.stringify(newRecords));
    if (onUpdate) onUpdate(newRecords);
  };

  const getOutcomeColor = (outcome) => {
    const colors = {
      correct: 'bg-green-100 text-green-800',
      incorrect: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
    };
    return colors[outcome] || colors.pending;
  };

  const getOutcomeLabel = (outcome) => {
    const labels = {
      correct: '✓ Correct',
      incorrect: '✗ Incorrect',
      partial: '~ Partial',
      pending: '? Pending',
    };
    return labels[outcome] || labels.pending;
  };

  // Group content by theme for tracking
  const byTheme = {};
  content.forEach(item => {
    if (item.themes) {
      item.themes.forEach(theme => {
        if (!byTheme[theme]) {
          byTheme[theme] = [];
        }
        byTheme[theme].push(item);
      });
    }
  });

  // Calculate accuracy by source
  const sourceAccuracy = {};
  content.forEach(item => {
    if (item.sourceId) {
      if (!sourceAccuracy[item.sourceId]) {
        sourceAccuracy[item.sourceId] = { correct: 0, total: 0 };
      }
      const record = trackRecords[item.id];
      if (record && record.outcome !== 'pending') {
        sourceAccuracy[item.sourceId].total++;
        if (record.outcome === 'correct') {
          sourceAccuracy[item.sourceId].correct++;
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Track Record Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Record</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Correct</p>
            <p className="text-2xl font-bold text-green-700">
              {Object.values(trackRecords).filter(r => r.outcome === 'correct').length}
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Incorrect</p>
            <p className="text-2xl font-bold text-red-700">
              {Object.values(trackRecords).filter(r => r.outcome === 'incorrect').length}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Partial</p>
            <p className="text-2xl font-bold text-yellow-700">
              {Object.values(trackRecords).filter(r => r.outcome === 'partial').length}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-700">
              {content.length - Object.keys(trackRecords).length}
            </p>
          </div>
        </div>

        {/* Source Accuracy */}
        {Object.keys(sourceAccuracy).length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Source Accuracy</h4>
            <div className="space-y-2">
              {Object.entries(sourceAccuracy).map(([sourceId, stats]) => {
                const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
                return (
                  <div key={sourceId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Source {sourceId.slice(0, 8)}...</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {stats.correct}/{stats.total} correct
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {Math.round(accuracy)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Content with Track Records */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Mark Outcomes</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {content.map(item => {
            const record = trackRecords[item.id];
            const currentOutcome = record?.outcome || 'pending';

            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title || 'Untitled'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                    {item.themes && item.themes.length > 0 && (
                      <span className="ml-2">
                        • {item.themes.join(', ')}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getOutcomeColor(currentOutcome)}`}>
                    {getOutcomeLabel(currentOutcome)}
                  </span>
                  <select
                    value={currentOutcome}
                    onChange={(e) => updateTrackRecord(item.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
