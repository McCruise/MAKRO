export default function ContentFilters({ filters, onFiltersChange, content, sources }) {
  // Get unique values for filters
  const sentiments = [...new Set(content.map(c => c.sentiment).filter(Boolean))];
  const themes = [...new Set(content.flatMap(c => c.themes || []))];
  const timeframes = [...new Set(content.map(c => c.timeframe).filter(Boolean))];
  const convictions = [...new Set(content.map(c => c.conviction).filter(Boolean))];

  const handleFilterChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [filterType]: newValues,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      sentiment: [],
      theme: [],
      timeframe: [],
      conviction: [],
      sourceId: '',
    });
  };

  const hasActiveFilters = 
    (filters.sentiment && filters.sentiment.length > 0) ||
    (filters.theme && filters.theme.length > 0) ||
    (filters.timeframe && filters.timeframe.length > 0) ||
    (filters.conviction && filters.conviction.length > 0) ||
    filters.sourceId;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sentiments.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
            <div className="space-y-1">
              {sentiments.map((sentiment) => (
                <label key={sentiment} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.sentiment || []).includes(sentiment)}
                    onChange={() => handleFilterChange('sentiment', sentiment)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{sentiment}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {themes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Themes</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {themes.map((theme) => (
                <label key={theme} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.theme || []).includes(theme)}
                    onChange={() => handleFilterChange('theme', theme)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{theme}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {timeframes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <div className="space-y-1">
              {timeframes.map((timeframe) => (
                <label key={timeframe} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.timeframe || []).includes(timeframe)}
                    onChange={() => handleFilterChange('timeframe', timeframe)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{timeframe}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {convictions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conviction</label>
            <div className="space-y-1">
              {convictions.map((conviction) => (
                <label key={conviction} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.conviction || []).includes(conviction)}
                    onChange={() => handleFilterChange('conviction', conviction)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{conviction}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
