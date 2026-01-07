import { useState, useEffect } from 'react';
import { detectConflicts } from '../utils/temporalAnalysis';

export default function ConflictDetection({ content }) {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    // Check for conflicts between all content items
    const allConflicts = [];
    
    content.forEach((item, index) => {
      const otherItems = content.filter((_, i) => i !== index);
      const itemConflicts = detectConflicts(item, otherItems);
      allConflicts.push(...itemConflicts);
    });

    // Remove duplicates
    const uniqueConflicts = [];
    const seen = new Set();
    
    allConflicts.forEach(conflict => {
      const key = `${conflict.newContentId}-${conflict.existingContentId}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueConflicts.push(conflict);
      }
    });

    setConflicts(uniqueConflicts);
  }, [content]);

  if (conflicts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No conflicts detected. All narratives are consistent.</p>
      </div>
    );
  }

  const getConflictContent = (contentId) => {
    return content.find(c => c.id === contentId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Conflict Detection</h3>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <div className="space-y-4">
        {conflicts.map((conflict, index) => {
          const newContent = getConflictContent(conflict.newContentId);
          const existingContent = getConflictContent(conflict.existingContentId);

          return (
            <div
              key={index}
              className="border-2 border-red-300 rounded-lg p-4 bg-red-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="px-2 py-1 bg-red-200 text-red-900 rounded text-xs font-medium">
                    {conflict.type === 'sentiment_conflict' ? 'Sentiment Conflict' : 'Ticker Sentiment Conflict'}
                  </span>
                  {conflict.severity === 'high' && (
                    <span className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs font-medium">
                      High Severity
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-200 rounded p-3 bg-white">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    {newContent?.title || 'Unknown Content'}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Date: {newContent?.date ? new Date(newContent.date).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Sentiment:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      conflict.newSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      conflict.newSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conflict.newSentiment}
                    </span>
                  </div>
                  {conflict.themes && conflict.themes.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600">Themes: </span>
                      {conflict.themes.map(theme => (
                        <span key={theme} className="text-xs px-1 py-0.5 bg-orange-100 text-orange-800 rounded mr-1">
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                  {conflict.tickers && conflict.tickers.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600">Tickers: </span>
                      {conflict.tickers.map(ticker => (
                        <span key={ticker} className="text-xs px-1 py-0.5 bg-purple-100 text-purple-800 rounded mr-1">
                          {ticker}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-red-200 rounded p-3 bg-white">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    {existingContent?.title || 'Unknown Content'}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Date: {existingContent?.date ? new Date(existingContent.date).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Sentiment:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      conflict.existingSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      conflict.existingSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conflict.existingSentiment}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-red-700">
                  <strong>Issue:</strong> These two pieces of content have conflicting sentiment on the same {conflict.themes ? 'themes' : 'tickers'}.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
