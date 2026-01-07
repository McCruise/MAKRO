import { truncateText } from '../utils/parser';

export default function ContentCard({ content, onClick }) {
  const getTypeColor = (type) => {
    const colors = {
      article: 'bg-blue-100 text-blue-800',
      link: 'bg-green-100 text-green-800',
      file: 'bg-purple-100 text-purple-800',
      tweet: 'bg-sky-100 text-sky-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800',
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
    <div
      onClick={() => onClick(content)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {content.title || 'Untitled'}
        </h3>
        <div className="flex gap-1 flex-shrink-0 ml-2">
          {content.sentiment && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(content.sentiment)}`}>
              {content.sentiment}
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.contentType)}`}>
            {content.contentType || 'article'}
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600 font-medium">{content.source || 'Unknown source'}</p>
        <p className="text-xs text-gray-500">{formatDate(content.date)}</p>
      </div>

      {content.extractedText && (
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">
          {truncateText(content.extractedText, 120)}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {content.themes && content.themes.length > 0 && (
          <>
            {content.themes.slice(0, 2).map((theme) => (
              <span
                key={theme}
                className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded"
              >
                {theme}
              </span>
            ))}
          </>
        )}
        {content.entities && content.entities.length > 0 && (
          <>
            {content.entities.slice(0, 2).map((entity) => (
              <span
                key={entity.id}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
              >
                {entity.name}
              </span>
            ))}
          </>
        )}
        {((content.themes && content.themes.length > 2) || (content.entities && content.entities.length > 2)) && (
          <span className="text-xs px-2 py-0.5 text-gray-500">
            +{((content.themes?.length || 0) + (content.entities?.length || 0)) - 2} more
          </span>
        )}
      </div>
    </div>
  );
}
