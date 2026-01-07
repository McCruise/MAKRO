/**
 * Cluster narratives by similarity
 * Groups content with similar themes, entities, and sentiment
 */
export function clusterNarratives(content) {
  if (!content || content.length === 0) return [];

  const clusters = [];
  const processed = new Set();

  content.forEach((item, index) => {
    if (processed.has(item.id)) return;

    const cluster = {
      id: `cluster-${index}`,
      items: [item],
      themes: new Set(),
      entities: new Set(),
      sentiment: item.sentiment || 'neutral',
      consensus: 1,
    };

    // Extract themes and entities from this item
    if (item.entities) {
      item.entities.forEach(e => {
        if (e.type === 'theme') cluster.themes.add(e.name);
        cluster.entities.add(e.name);
      });
    }

    // Find similar items
    content.slice(index + 1).forEach(otherItem => {
      if (processed.has(otherItem.id)) return;

      const similarity = calculateSimilarity(item, otherItem);
      if (similarity > 0.3) { // Threshold for clustering
        cluster.items.push(otherItem);
        processed.add(otherItem.id);

        // Merge themes and entities
        if (otherItem.entities) {
          otherItem.entities.forEach(e => {
            if (e.type === 'theme') cluster.themes.add(e.name);
            cluster.entities.add(e.name);
          });
        }

        // Update consensus
        if (otherItem.sentiment === cluster.sentiment) {
          cluster.consensus++;
        }
      }
    });

    processed.add(item.id);
    clusters.push({
      ...cluster,
      themes: Array.from(cluster.themes),
      entities: Array.from(cluster.entities),
      consensus: cluster.consensus / cluster.items.length,
      isContrarian: cluster.items.length <= 2 && cluster.consensus < 0.5,
    });
  });

  return clusters;
}

/**
 * Calculate similarity between two content items
 */
function calculateSimilarity(item1, item2) {
  let score = 0;
  let factors = 0;

  // Sentiment similarity
  if (item1.sentiment && item2.sentiment) {
    if (item1.sentiment === item2.sentiment) {
      score += 0.3;
    }
    factors += 0.3;
  }

  // Entity overlap
  if (item1.entities && item2.entities) {
    const entities1 = new Set(item1.entities.map(e => e.name.toLowerCase()));
    const entities2 = new Set(item2.entities.map(e => e.name.toLowerCase()));
    const intersection = new Set([...entities1].filter(x => entities2.has(x)));
    const union = new Set([...entities1, ...entities2]);
    
    if (union.size > 0) {
      score += (intersection.size / union.size) * 0.5;
    }
    factors += 0.5;
  }

  // Theme overlap
  if (item1.themes && item2.themes) {
    const themes1 = new Set(item1.themes.map(t => t.toLowerCase()));
    const themes2 = new Set(item2.themes.map(t => t.toLowerCase()));
    const intersection = new Set([...themes1].filter(x => themes2.has(x)));
    const union = new Set([...themes1, ...themes2]);
    
    if (union.size > 0) {
      score += (intersection.size / union.size) * 0.2;
    }
    factors += 0.2;
  }

  return factors > 0 ? score / factors : 0;
}

/**
 * Detect consensus vs contrarian takes
 */
export function detectConsensus(cluster) {
  if (cluster.items.length === 0) return 'unknown';

  const sentimentCounts = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };

  cluster.items.forEach(item => {
    const sentiment = item.sentiment || 'neutral';
    sentimentCounts[sentiment]++;
  });

  const total = cluster.items.length;
  const maxSentiment = Math.max(
    sentimentCounts.positive,
    sentimentCounts.negative,
    sentimentCounts.neutral
  );

  const consensusRatio = maxSentiment / total;

  if (consensusRatio >= 0.7) {
    return 'consensus';
  } else if (consensusRatio >= 0.5) {
    return 'moderate';
  } else {
    return 'contrarian';
  }
}
