import { useState } from 'react';

export default function NarrativeCard({ narrative, onContentClick }) {
  const [expanded, setExpanded] = useState(false);

  const getConsensusColor = (consensus) => {
    const colors = {
      consensus_positive: 'bg-green-100 text-green-800 border-green-300',
      consensus_negative: 'bg-red-100 text-red-800 border-red-300',
      consensus_neutral: 'bg-gray-100 text-gray-800 border-gray-300',
      majority_positive: 'bg-green-50 text-green-700 border-green-200',
      majority_negative: 'bg-red-50 text-red-700 border-red-200',
      majority_neutral: 'bg-gray-50 text-gray-700 border-gray-200',
      dissent: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      mixed: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[consensus] || colors.mixed;
  };

  const getConsensusLabel = (consensus) => {
    const labels = {
      consensus_positive: 'Strong Consensus (Bullish)',
      consensus_negative: 'Strong Consensus (Bearish)',
      consensus_neutral: 'Strong Consensus (Neutral)',
      majority_positive: 'Majority Bullish',
      majority_negative: 'Majority Bearish',
      majority_neutral: 'Majority Neutral',
      dissent: 'Significant Dissent',
      mixed: 'Mixed Views',
    };
    return labels[consensus] || 'Unknown';
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getConsensusColor(narrative.consensus)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{narrative.theme}</h3>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-50">
              {getConsensusLabel(narrative.consensus)}
            </span>
            <span className="text-sm text-gray-700">
              {Math.round(narrative.consensusPercent)}% agreement
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 hover:text-gray-900"
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Thesis:</h4>
        <p className="text-sm text-gray-800 bg-white bg-opacity-50 rounded p-3">
          {narrative.thesis}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Supporting Voices ({narrative.supportingVoices.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {narrative.supportingVoices.slice(0, expanded ? undefined : 3).map((voice, index) => (
              <div
                key={index}
                className="text-xs bg-white bg-opacity-50 rounded p-2 cursor-pointer hover:bg-opacity-75"
                onClick={() => onContentClick(voice.content)}
              >
                <span className="font-medium">{voice.source}</span>
                <span className="text-gray-600 ml-2">
                  {new Date(voice.date).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!expanded && narrative.supportingVoices.length > 3 && (
              <div className="text-xs text-gray-600">
                +{narrative.supportingVoices.length - 3} more
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Counter-Arguments ({narrative.counterArguments.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {narrative.counterArguments.slice(0, expanded ? undefined : 3).map((counter, index) => (
              <div
                key={index}
                className="text-xs bg-white bg-opacity-50 rounded p-2 cursor-pointer hover:bg-opacity-75"
                onClick={() => onContentClick(counter.content)}
              >
                <span className="font-medium">{counter.source}</span>
                <span className="text-gray-600 ml-2">
                  {new Date(counter.date).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!expanded && narrative.counterArguments.length > 3 && (
              <div className="text-xs text-gray-600">
                +{narrative.counterArguments.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-current border-opacity-20">
        <span>Total: {narrative.total} items</span>
        <span>
          ↑{narrative.positive} →{narrative.neutral} ↓{narrative.negative}
        </span>
      </div>
    </div>
  );
}
