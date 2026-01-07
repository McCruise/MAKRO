import { useState } from 'react';
import { trackNarrativeEvolution } from '../utils/narrativeIntelligence';

export default function NarrativeEvolutionView({ content, sources }) {
  const [selectedTheme, setSelectedTheme] = useState('');

  // Get all unique themes
  const themes = [...new Set(content.flatMap(c => c.themes || []))];

  if (themes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No themes available. Tag content with themes to see narrative evolution.</p>
      </div>
    );
  }

  const evolution = selectedTheme 
    ? trackNarrativeEvolution(content, selectedTheme, sources)
    : null;

  const getPhaseColor = (phase) => {
    const colors = {
      bullish: 'bg-green-100 text-green-800 border-green-300',
      bearish: 'bg-red-100 text-red-800 border-red-300',
      neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[phase] || colors.neutral;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Narrative Evolution</h3>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a theme...</option>
          {themes.map(theme => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
      </div>

      {!selectedTheme && (
        <p className="text-gray-500 text-center py-8">Select a theme above to see its evolution over time</p>
      )}

      {evolution && evolution.evolution.length === 0 && (
        <p className="text-gray-500 text-center py-8">No evolution data available for this theme</p>
      )}

      {evolution && evolution.evolution.length > 0 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Theme: {evolution.theme}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {evolution.totalItems} items tracked
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Sentiment</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  evolution.currentSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  evolution.currentSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {evolution.currentSentiment || 'neutral'}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            <div className="space-y-4">
              {evolution.evolution.map((phase, index) => {
                if (phase.type === 'inflection') {
                  return (
                    <div key={index} className="relative pl-12">
                      <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-600"></div>
                      <div className="border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-800 font-bold">⚡</span>
                          <span className="font-semibold text-gray-900">Inflection Point</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Sentiment shifted from <strong>{phase.from}</strong> to <strong>{phase.to}</strong>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(phase.date).toLocaleDateString()} - {phase.source}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} className="relative pl-12">
                    <div className={`absolute left-2 top-2 w-4 h-4 rounded-full border-2 ${
                      phase.phase === 'bullish' ? 'bg-green-500 border-green-700' :
                      phase.phase === 'bearish' ? 'bg-red-500 border-red-700' :
                      'bg-gray-500 border-gray-700'
                    }`}></div>
                    <div className={`border-2 rounded-lg p-4 ${getPhaseColor(phase.phase)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 capitalize">{phase.phase} Phase</h4>
                        <span className="text-xs text-gray-600">
                          {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      {phase.items && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">
                            {phase.items.length} items in this phase
                          </p>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {phase.items.slice(0, 3).map(item => (
                              <div key={item.id} className="text-xs bg-white bg-opacity-50 rounded p-1">
                                {item.title || 'Untitled'}
                              </div>
                            ))}
                            {phase.items.length > 3 && (
                              <div className="text-xs text-gray-600">
                                +{phase.items.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
