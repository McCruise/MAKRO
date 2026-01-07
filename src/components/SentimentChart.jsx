import { getSentimentOverTime } from '../utils/temporalAnalysis';

export default function SentimentChart({ content }) {
  const data = getSentimentOverTime(content);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No sentiment data over time. Add content with dates and sentiment to see the chart.</p>
      </div>
    );
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.total));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Over Time</h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const date = new Date(item.date);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          return (
            <div key={item.date} className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600 w-20">{dateStr}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  {/* Positive (green) */}
                  {item.positivePercent > 0 && (
                    <div
                      className="absolute left-0 top-0 h-full bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${item.positivePercent}%` }}
                    >
                      {item.positivePercent > 10 && `↑${item.positive}`}
                    </div>
                  )}
                  {/* Neutral (gray) */}
                  {item.neutralPercent > 0 && (
                    <div
                      className="absolute h-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        left: `${item.positivePercent}%`,
                        width: `${item.neutralPercent}%`,
                      }}
                    >
                      {item.neutralPercent > 10 && `→${item.neutral}`}
                    </div>
                  )}
                  {/* Negative (red) */}
                  {item.negativePercent > 0 && (
                    <div
                      className="absolute right-0 top-0 h-full bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${item.negativePercent}%` }}
                    >
                      {item.negativePercent > 10 && `↓${item.negative}`}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">{item.total}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Positive</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Negative</span>
        </div>
      </div>
    </div>
  );
}
