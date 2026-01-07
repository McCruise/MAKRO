import { getMostMentionedThemes, getMostMentionedStocks } from '../utils/temporalAnalysis';

export default function MostMentioned({ content }) {
  const themes = getMostMentionedThemes(content, 10);
  const stocks = getMostMentionedStocks(content, 10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Most Mentioned Themes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Mentioned Themes</h3>
        {themes.length === 0 ? (
          <p className="text-sm text-gray-500">No themes tagged yet</p>
        ) : (
          <div className="space-y-3">
            {themes.map((item, index) => (
              <div key={item.theme} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{item.theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(item.count / themes[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Most Mentioned Stocks */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Mentioned Stocks</h3>
        {stocks.length === 0 ? (
          <p className="text-sm text-gray-500">No stocks/tickers tagged yet</p>
        ) : (
          <div className="space-y-3">
            {stocks.map((item, index) => (
              <div key={item.ticker} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">{item.ticker}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(item.count / stocks[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
