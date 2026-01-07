import { useState } from 'react';
import { getSourcePerspective } from '../utils/narrativeIntelligence';
import ContentCard from './ContentCard';

export default function SourcePerspectiveView({ content, sources, onCardClick }) {
  const [selectedSourceId, setSelectedSourceId] = useState('');

  if (sources.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No sources available. Add sources to see their perspectives.</p>
      </div>
    );
  }

  const perspective = selectedSourceId 
    ? getSourcePerspective(content, selectedSourceId, sources)
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Perspective</h3>
        <select
          value={selectedSourceId}
          onChange={(e) => setSelectedSourceId(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a source...</option>
          {sources.map(source => (
            <option key={source.id} value={source.id}>
              {source.name} ({content.filter(c => c.sourceId === source.id).length} items)
            </option>
          ))}
        </select>
      </div>

      {!selectedSourceId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-500">Select a source above to see all their narratives and views</p>
        </div>
      )}

      {perspective && (
        <>
          {/* Source Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{perspective.source.name}</h4>
                {perspective.source.background && (
                  <p className="text-sm text-gray-600 mt-1">{perspective.source.background}</p>
                )}
                {perspective.source.type && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {perspective.source.type}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{perspective.totalContent}</p>
              </div>
            </div>

            {/* Sentiment Breakdown */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Positive</p>
                <p className="text-xl font-bold text-green-700">{perspective.sentimentBreakdown.positive}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Neutral</p>
                <p className="text-xl font-bold text-gray-700">{perspective.sentimentBreakdown.neutral}</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Negative</p>
                <p className="text-xl font-bold text-red-700">{perspective.sentimentBreakdown.negative}</p>
              </div>
            </div>
          </div>

          {/* Narratives by Theme */}
          {Object.keys(perspective.byTheme).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Narratives by Theme</h4>
              <div className="space-y-4">
                {Object.entries(perspective.byTheme).map(([theme, items]) => (
                  <div key={theme} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">{theme}</h5>
                      <span className="text-sm text-gray-600">{items.length} items</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map(item => (
                        <span
                          key={item.id}
                          className={`px-2 py-1 rounded text-xs ${
                            item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            item.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.title || 'Untitled'} ({item.sentiment || 'neutral'})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Content from Source */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">All Content</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perspective.narratives.map(item => (
                <ContentCard key={item.id} content={item} onClick={onCardClick} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
