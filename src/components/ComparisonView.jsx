import { useState } from 'react';
import { getChangesSince } from '../utils/temporalAnalysis';

export default function ComparisonView({ content }) {
  const [timeframe, setTimeframe] = useState('week');

  const getSinceDate = () => {
    const now = new Date();
    if (timeframe === 'week') {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'month') {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  };

  const changes = getChangesSince(content, getSinceDate());

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">What's Changed?</h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Content */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">New Content</h4>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {changes.recentContentCount}
          </div>
          <p className="text-sm text-gray-600">
            items added in the last {timeframe === 'week' ? '7 days' : '30 days'}
          </p>
        </div>

        {/* Sentiment Shift */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Sentiment Shift</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Positive</span>
              <span className={`text-sm font-semibold ${
                changes.sentimentShift.positive > 0 ? 'text-green-600' :
                changes.sentimentShift.positive < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {changes.sentimentShift.positive > 0 ? '+' : ''}{changes.sentimentShift.positive}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Neutral</span>
              <span className={`text-sm font-semibold ${
                changes.sentimentShift.neutral > 0 ? 'text-green-600' :
                changes.sentimentShift.neutral < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {changes.sentimentShift.neutral > 0 ? '+' : ''}{changes.sentimentShift.neutral}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Negative</span>
              <span className={`text-sm font-semibold ${
                changes.sentimentShift.negative > 0 ? 'text-green-600' :
                changes.sentimentShift.negative < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {changes.sentimentShift.negative > 0 ? '+' : ''}{changes.sentimentShift.negative}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Themes */}
      {changes.addedThemes.length > 0 && (
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">New Themes Emerging</h4>
          <div className="flex flex-wrap gap-2">
            {changes.addedThemes.map(theme => (
              <span
                key={theme}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                + {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Removed Themes */}
      {changes.removedThemes.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Themes Fading</h4>
          <div className="flex flex-wrap gap-2">
            {changes.removedThemes.map(theme => (
              <span
                key={theme}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                - {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Content List */}
      {changes.recentContent.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Recent Content</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {changes.recentContent.slice(0, 10).map(item => (
              <div
                key={item.id}
                className="border border-gray-200 rounded p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title || 'Untitled'}</p>
                  <p className="text-xs text-gray-500">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                  </p>
                </div>
                {item.sentiment && (
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    item.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.sentiment}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
