export default function SourceCard({ source, contentCount, onClick, onEdit }) {
  const getTypeColor = (type) => {
    const colors = {
      macro: 'bg-blue-100 text-blue-800',
      quant: 'bg-purple-100 text-purple-800',
      fundamental: 'bg-green-100 text-green-800',
      institution: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getTypeColor(source.type)}`}>
            {source.type}
          </span>
        </div>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(source);
            }}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {source.background && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{source.background}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{contentCount}</span> content items
        </span>
        {onClick && (
          <button
            onClick={() => onClick(source)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Content →
          </button>
        )}
      </div>
    </div>
  );
}
