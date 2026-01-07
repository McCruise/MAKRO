import { useState } from 'react';

export default function NarrativeTimeline({ content, themes }) {
  const [selectedTheme, setSelectedTheme] = useState(themes && themes.length > 0 ? themes[0] : '');

  if (!content || content.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No content available for timeline</p>
      </div>
    );
  }

  // Get all unique themes
  const allThemes = [...new Set(content.flatMap(c => c.themes || []))];

  // Filter content by selected theme
  const themeContent = selectedTheme
    ? content.filter(c => c.themes && c.themes.includes(selectedTheme))
    : content;

  // Sort by date
  const sortedContent = [...themeContent].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateA - dateB;
  });

  // Detect inflection points (sentiment changes)
  const inflectionPoints = [];
  for (let i = 1; i < sortedContent.length; i++) {
    const prev = sortedContent[i - 1];
    const curr = sortedContent[i];
    
    if (prev.sentiment && curr.sentiment && prev.sentiment !== curr.sentiment) {
      inflectionPoints.push({
        date: curr.date || curr.createdAt,
        from: prev.sentiment,
        to: curr.sentiment,
        content: curr,
      });
    }
  }

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-green-100 text-green-800 border-green-300',
      negative: 'bg-red-100 text-red-800 border-red-300',
      neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[sentiment] || colors.neutral;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Narrative Evolution Timeline</h3>
        {allThemes.length > 0 && (
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Themes</option>
            {allThemes.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        )}
      </div>

      {sortedContent.length === 0 ? (
        <p className="text-sm text-gray-500">No content found for selected theme</p>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          <div className="space-y-4">
            {sortedContent.map((item, index) => {
              const isInflection = inflectionPoints.some(ip => ip.content.id === item.id);
              
              return (
                <div key={item.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-2 top-2 w-4 h-4 rounded-full border-2 ${
                    isInflection 
                      ? 'bg-yellow-400 border-yellow-600' 
                      : getSentimentColor(item.sentiment || 'neutral').split(' ')[0]
                  }`}></div>

                  {/* Inflection point indicator */}
                  {isInflection && (
                    <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">⚡</span>
                    </div>
                  )}

                  {/* Content card */}
                  <div className={`border-2 rounded-lg p-4 ${
                    isInflection 
                      ? 'border-yellow-400 bg-yellow-50' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title || 'Untitled'}</h4>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(item.date || item.createdAt)}</p>
                      </div>
                      {item.sentiment && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                          {item.sentiment}
                        </span>
                      )}
                    </div>

                    {isInflection && (
                      <div className="mb-2 px-2 py-1 bg-yellow-100 rounded text-xs text-yellow-800">
                        <strong>Inflection Point:</strong> Sentiment changed from {inflectionPoints.find(ip => ip.content.id === item.id)?.from} to {inflectionPoints.find(ip => ip.content.id === item.id)?.to}
                      </div>
                    )}

                    {item.themes && item.themes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.themes.map(theme => (
                          <span
                            key={theme}
                            className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
