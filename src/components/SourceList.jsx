import SourceCard from './SourceCard';

export default function SourceList({ sources, content, onSourceClick, onEditSource }) {
  const getContentCount = (sourceId) => {
    if (!content) return 0;
    return content.filter(item => item.sourceId === sourceId).length;
  };

  if (!sources || sources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No sources yet. Add your first source to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sources.map((source) => (
        <SourceCard
          key={source.id}
          source={source}
          contentCount={getContentCount(source.id)}
          onClick={onSourceClick}
          onEdit={onEditSource}
        />
      ))}
    </div>
  );
}
