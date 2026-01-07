import { clusterNarratives, detectConsensus } from '../utils/narrativeClustering';
import ContentCard from './ContentCard';

export default function NarrativeClusters({ content, onCardClick }) {
  const clusters = clusterNarratives(content);

  if (clusters.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No narrative clusters found. Add more content with similar themes and entities to see clustering.</p>
      </div>
    );
  }

  const getConsensusColor = (consensusType) => {
    const colors = {
      consensus: 'bg-green-100 text-green-800 border-green-300',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      contrarian: 'bg-red-100 text-red-800 border-red-300',
      unknown: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[consensusType] || colors.unknown;
  };

  return (
    <div className="space-y-6">
      {clusters.map((cluster) => {
        const consensusType = detectConsensus(cluster);
        return (
          <div
            key={cluster.id}
            className={`border-2 rounded-lg p-6 ${getConsensusColor(consensusType)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Narrative Cluster</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="capitalize font-medium">{consensusType}</span>
                  <span>{cluster.items.length} items</span>
                  <span>{Math.round(cluster.consensus * 100)}% consensus</span>
                </div>
              </div>
              {cluster.isContrarian && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-200 text-red-900">
                  Contrarian
                </span>
              )}
            </div>

            {cluster.themes.length > 0 && (
              <div className="mb-3">
                <span className="text-sm font-medium mr-2">Themes:</span>
                {cluster.themes.map((theme) => (
                  <span
                    key={theme}
                    className="inline-block px-2 py-1 rounded text-xs bg-white bg-opacity-50 mr-1 mb-1"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {cluster.items.map((item) => (
                <div key={item.id} className="bg-white bg-opacity-50 rounded p-3">
                  <ContentCard content={item} onClick={onCardClick} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
