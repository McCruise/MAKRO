import { aggregateSentimentByAsset, aggregateSentimentByTheme } from '../utils/sentiment';

export default function SentimentAggregation({ content, view = 'assets' }) {
  // Get all unique assets (tickers)
  const assets = [...new Set(
    content
      .flatMap(c => c.entities || [])
      .filter(e => e.type === 'ticker')
      .map(e => e.name)
  )];

  // Get all unique themes
  const themes = [...new Set(content.flatMap(c => c.themes || []))];

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-green-100 text-green-800 border-green-300',
      negative: 'bg-red-100 text-red-800 border-red-300',
      neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[sentiment] || colors.neutral;
  };

  if (view === 'assets') {
    const assetSentiments = assets.map(asset => ({
      asset,
      ...aggregateSentimentByAsset(content, asset),
    })).filter(a => a.count > 0);

    if (assetSentiments.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No asset sentiment data available. Tag content with tickers to see sentiment aggregation.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {assetSentiments.map(({ asset, sentiment, confidence, count, breakdown }) => (
          <div
            key={asset}
            className={`border-2 rounded-lg p-4 ${getSentimentColor(sentiment)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{asset}</h3>
              <span className="text-sm font-medium">{count} items</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm font-medium capitalize">{sentiment}</span>
                <span className="text-xs ml-2">({confidence}% confidence)</span>
              </div>
              {breakdown && (
                <div className="flex gap-3 text-xs">
                  <span className="text-green-700">↑ {breakdown.positive}</span>
                  <span className="text-gray-600">→ {breakdown.neutral}</span>
                  <span className="text-red-700">↓ {breakdown.negative}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (view === 'themes') {
    const themeSentiments = themes.map(theme => ({
      theme,
      ...aggregateSentimentByTheme(content, theme),
    })).filter(t => t.count > 0);

    if (themeSentiments.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No theme sentiment data available. Tag content with macro themes to see sentiment aggregation.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {themeSentiments.map(({ theme, sentiment, confidence, count, breakdown }) => (
          <div
            key={theme}
            className={`border-2 rounded-lg p-4 ${getSentimentColor(sentiment)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{theme}</h3>
              <span className="text-sm font-medium">{count} items</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm font-medium capitalize">{sentiment}</span>
                <span className="text-xs ml-2">({confidence}% confidence)</span>
              </div>
              {breakdown && (
                <div className="flex gap-3 text-xs">
                  <span className="text-green-700">↑ {breakdown.positive}</span>
                  <span className="text-gray-600">→ {breakdown.neutral}</span>
                  <span className="text-red-700">↓ {breakdown.negative}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
