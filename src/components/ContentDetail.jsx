export default function ContentDetail({ content, onClose }) {
  if (!content) return null;

  const getTypeColor = (type) => {
    const colors = {
      article: 'bg-blue-100 text-blue-800',
      link: 'bg-green-100 text-green-800',
      file: 'bg-purple-100 text-purple-800',
      tweet: 'bg-sky-100 text-sky-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{content.title || 'Untitled'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div>
              <span className="text-sm text-gray-600">Source:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">{content.source || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Date:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">{formatDate(content.date)}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(content.contentType)}`}>
              {content.contentType || 'article'}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Content:</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap">{content.content || 'No content'}</p>
            </div>
          </div>

          {content.extractedText && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Extracted Text:</h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-800 whitespace-pre-wrap">{content.extractedText}</p>
              </div>
            </div>
          )}

          {content.entities && content.entities.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tagged Entities:</h3>
              <div className="flex flex-wrap gap-2">
                {content.entities.map((entity) => {
                  const getEntityColor = (type) => {
                    const colors = {
                      person: 'bg-blue-100 text-blue-800',
                      institution: 'bg-green-100 text-green-800',
                      ticker: 'bg-purple-100 text-purple-800',
                      sector: 'bg-orange-100 text-orange-800',
                      theme: 'bg-pink-100 text-pink-800',
                    };
                    return colors[type] || 'bg-gray-100 text-gray-800';
                  };
                  return (
                    <span
                      key={entity.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getEntityColor(entity.type)}`}
                    >
                      {entity.name} ({entity.type})
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            <p>Created: {new Date(content.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
