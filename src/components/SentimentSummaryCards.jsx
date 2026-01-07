export default function SentimentSummaryCards({ content }) {
  // Overall sentiment
  const total = content.length;
  const positive = content.filter(c => c.sentiment === 'positive').length;
  const negative = content.filter(c => c.sentiment === 'negative').length;
  const neutral = content.filter(c => c.sentiment === 'neutral' || !c.sentiment).length;

  // By asset class (using tickers as proxy)
  const tickerContent = content.filter(c => 
    c.entities && c.entities.some(e => e.type === 'ticker')
  );
  const tickerPositive = tickerContent.filter(c => c.sentiment === 'positive').length;
  const tickerNegative = tickerContent.filter(c => c.sentiment === 'negative').length;
  const tickerNeutral = tickerContent.filter(c => c.sentiment === 'neutral' || !c.sentiment).length;

  // By theme
  const themeContent = content.filter(c => c.themes && c.themes.length > 0);
  const themePositive = themeContent.filter(c => c.sentiment === 'positive').length;
  const themeNegative = themeContent.filter(c => c.sentiment === 'negative').length;
  const themeNeutral = themeContent.filter(c => c.sentiment === 'neutral' || !c.sentiment).length;

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-green-100 text-green-800 border-green-300',
      negative: 'bg-red-100 text-red-800 border-red-300',
      neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[sentiment] || colors.neutral;
  };

  const Card = ({ title, positive, negative, neutral, total }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Positive</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${total > 0 ? (positive / total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8">{positive}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Neutral</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-400 h-2 rounded-full"
                style={{ width: `${total > 0 ? (neutral / total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8">{neutral}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Negative</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${total > 0 ? (negative / total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8">{negative}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span className="text-sm font-bold text-gray-900">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        title="Overall Sentiment"
        positive={positive}
        negative={negative}
        neutral={neutral}
        total={total}
      />
      <Card
        title="Asset Class Sentiment"
        positive={tickerPositive}
        negative={tickerNegative}
        neutral={tickerNeutral}
        total={tickerContent.length}
      />
      <Card
        title="Theme Sentiment"
        positive={themePositive}
        negative={themeNegative}
        neutral={themeNeutral}
        total={themeContent.length}
      />
    </div>
  );
}
