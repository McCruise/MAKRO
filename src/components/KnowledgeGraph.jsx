export default function KnowledgeGraph({ content, sources }) {
  // Build graph data
  const buildGraph = () => {
    const nodes = [];
    const links = [];

    // Add source nodes
    const sourceMap = new Map();
    sources.forEach((source) => {
      const nodeId = `source-${source.id}`;
      sourceMap.set(source.id, nodeId);
      nodes.push({
        id: nodeId,
        label: source.name,
        type: 'source',
        group: source.type,
      });
    });

    // Add content nodes and entity nodes
    const entityMap = new Map();
    content.forEach((item) => {
      const contentNodeId = `content-${item.id}`;
      nodes.push({
        id: contentNodeId,
        label: item.title || 'Untitled',
        type: 'content',
        group: item.contentType,
      });

      // Link content to source
      if (item.sourceId && sourceMap.has(item.sourceId)) {
        links.push({
          source: sourceMap.get(item.sourceId),
          target: contentNodeId,
          type: 'source-content',
        });
      }

      // Add entity nodes and links
      if (item.entities && item.entities.length > 0) {
        item.entities.forEach((entity) => {
          const entityNodeId = `entity-${entity.id}`;
          
          if (!entityMap.has(entity.id)) {
            entityMap.set(entity.id, entityNodeId);
            nodes.push({
              id: entityNodeId,
              label: entity.name,
              type: 'entity',
              group: entity.type,
            });
          }

          links.push({
            source: contentNodeId,
            target: entityNodeId,
            type: 'content-entity',
          });
        });
      }
    });

    return { nodes, links };
  };

  const { nodes, links } = buildGraph();

  const getNodeColor = (type, group) => {
    if (type === 'source') {
      const colors = {
        macro: 'bg-blue-500',
        quant: 'bg-purple-500',
        fundamental: 'bg-green-500',
        institution: 'bg-orange-500',
        other: 'bg-gray-500',
      };
      return colors[group] || 'bg-gray-500';
    }
    if (type === 'content') {
      const colors = {
        article: 'bg-blue-300',
        link: 'bg-green-300',
        file: 'bg-purple-300',
        tweet: 'bg-sky-300',
      };
      return colors[group] || 'bg-gray-300';
    }
    if (type === 'entity') {
      const colors = {
        person: 'bg-blue-200',
        institution: 'bg-green-200',
        ticker: 'bg-purple-200',
        sector: 'bg-orange-200',
        theme: 'bg-pink-200',
      };
      return colors[group] || 'bg-gray-200';
    }
    return 'bg-gray-400';
  };

  if (nodes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No data to visualize. Add sources and content to see the knowledge graph.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Knowledge Graph</h3>
        <p className="text-sm text-gray-600">
          Showing {nodes.length} nodes and {links.length} connections
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-700 mb-2">Sources</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-gray-600">Macro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-gray-600">Quant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-600">Fundamental</span>
            </div>
          </div>
        </div>
        <div>
          <p className="font-medium text-gray-700 mb-2">Content</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-300"></div>
              <span className="text-gray-600">Article</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-300"></div>
              <span className="text-gray-600">Link</span>
            </div>
          </div>
        </div>
        <div>
          <p className="font-medium text-gray-700 mb-2">Entities</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-200"></div>
              <span className="text-gray-600">Person/Ticker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-pink-200"></div>
              <span className="text-gray-600">Theme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Visualization - Simple list-based view */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sources.map((source) => {
          const sourceContent = content.filter((c) => c.sourceId === source.id);
          if (sourceContent.length === 0) return null;

          return (
            <div key={source.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${getNodeColor('source', source.type)}`}></div>
                <h4 className="font-semibold text-gray-900">{source.name}</h4>
                <span className="text-xs text-gray-500">({sourceContent.length} items)</span>
              </div>
              <div className="ml-5 space-y-2">
                {sourceContent.map((item) => (
                  <div key={item.id} className="border-l-2 border-gray-300 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getNodeColor('content', item.contentType)}`}></div>
                      <span className="text-sm font-medium text-gray-800">{item.title || 'Untitled'}</span>
                    </div>
                    {item.entities && item.entities.length > 0 && (
                      <div className="ml-4 flex flex-wrap gap-1 mt-1">
                        {item.entities.map((entity) => (
                          <span
                            key={entity.id}
                            className={`text-xs px-2 py-0.5 rounded ${getNodeColor('entity', entity.type)} text-gray-700`}
                          >
                            {entity.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
