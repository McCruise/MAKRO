import ContentCard from './ContentCard';

export default function ContentGrid({ content, onCardClick }) {
  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No content yet. Add your first item to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item) => (
        <ContentCard key={item.id} content={item} onClick={onCardClick} />
      ))}
    </div>
  );
}
