export default function MarketMoodIndicator({ content }) {
  if (!content || content.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No data available for market mood</p>
      </div>
    );
  }

  const positive = content.filter(c => c.sentiment === 'positive').length;
  const negative = content.filter(c => c.sentiment === 'negative').length;
  const neutral = content.filter(c => c.sentiment === 'neutral' || !c.sentiment).length;
  const total = content.length;

  const positivePercent = total > 0 ? (positive / total) * 100 : 0;
  const negativePercent = total > 0 ? (negative / total) * 100 : 0;
  const neutralPercent = total > 0 ? (neutral / total) * 100 : 0;

  // Determine overall mood
  let mood = 'neutral';
  let moodColor = 'bg-gray-500';
  let moodIcon = '→';
  let moodText = 'Neutral';

  if (positivePercent > 50) {
    mood = 'bullish';
    moodColor = 'bg-green-500';
    moodIcon = '📈';
    moodText = 'Bullish';
  } else if (negativePercent > 50) {
    mood = 'bearish';
    moodColor = 'bg-red-500';
    moodIcon = '📉';
    moodText = 'Bearish';
  } else if (positivePercent > negativePercent) {
    mood = 'cautiously-bullish';
    moodColor = 'bg-green-400';
    moodIcon = '📊';
    moodText = 'Cautiously Bullish';
  } else if (negativePercent > positivePercent) {
    mood = 'cautiously-bearish';
    moodColor = 'bg-red-400';
    moodIcon = '📊';
    moodText = 'Cautiously Bearish';
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Market Mood</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className={`${moodColor} rounded-full w-32 h-32 flex items-center justify-center text-white text-5xl`}>
          {moodIcon}
        </div>
      </div>

      <div className="text-center mb-6">
        <h4 className="text-2xl font-bold text-gray-900 mb-2">{moodText}</h4>
        <p className="text-sm text-gray-600">
          Based on {total} content items
        </p>
      </div>

      {/* Heatmap */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Bullish</span>
            <span className="text-sm text-gray-600">{Math.round(positivePercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all"
              style={{ width: `${positivePercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Neutral</span>
            <span className="text-sm text-gray-600">{Math.round(neutralPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gray-400 h-4 rounded-full transition-all"
              style={{ width: `${neutralPercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Bearish</span>
            <span className="text-sm text-gray-600">{Math.round(negativePercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-red-500 h-4 rounded-full transition-all"
              style={{ width: `${negativePercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
