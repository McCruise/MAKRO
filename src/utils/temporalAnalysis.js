/**
 * Analyze sentiment over time
 */
export function getSentimentOverTime(content) {
  if (!content || content.length === 0) return [];

  // Group by date
  const byDate = {};
  
  content.forEach(item => {
    if (!item.date || !item.sentiment) return;
    
    const date = new Date(item.date).toISOString().split('T')[0];
    if (!byDate[date]) {
      byDate[date] = { positive: 0, negative: 0, neutral: 0, total: 0 };
    }
    
    byDate[date][item.sentiment]++;
    byDate[date].total++;
  });

  // Convert to array and calculate percentages
  return Object.entries(byDate)
    .map(([date, counts]) => ({
      date,
      positive: counts.positive,
      negative: counts.negative,
      neutral: counts.neutral,
      total: counts.total,
      positivePercent: Math.round((counts.positive / counts.total) * 100),
      negativePercent: Math.round((counts.negative / counts.total) * 100),
      neutralPercent: Math.round((counts.neutral / counts.total) * 100),
      netSentiment: counts.positive - counts.negative, // Positive = bullish, negative = bearish
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get most mentioned themes
 */
export function getMostMentionedThemes(content, limit = 10) {
  const themeCounts = {};
  
  content.forEach(item => {
    if (item.themes && item.themes.length > 0) {
      item.themes.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    }
  });

  return Object.entries(themeCounts)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get most mentioned stocks/tickers
 */
export function getMostMentionedStocks(content, limit = 10) {
  const tickerCounts = {};
  
  content.forEach(item => {
    if (item.entities && item.entities.length > 0) {
      item.entities.forEach(entity => {
        if (entity.type === 'ticker') {
          tickerCounts[entity.name] = (tickerCounts[entity.name] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(tickerCounts)
    .map(([ticker, count]) => ({ ticker, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Detect conflicts with existing narratives
 */
export function detectConflicts(newContent, existingContent) {
  const conflicts = [];

  if (!newContent || !existingContent || existingContent.length === 0) {
    return conflicts;
  }

  // Check for sentiment conflicts on same themes
  const newThemes = newContent.themes || [];
  const newSentiment = newContent.sentiment;

  existingContent.forEach(existing => {
    const existingThemes = existing.themes || [];
    const existingSentiment = existing.sentiment;

    // Find overlapping themes
    const overlappingThemes = newThemes.filter(t => existingThemes.includes(t));

    if (overlappingThemes.length > 0 && newSentiment && existingSentiment) {
      // Check if sentiments conflict (positive vs negative)
      if (
        (newSentiment === 'positive' && existingSentiment === 'negative') ||
        (newSentiment === 'negative' && existingSentiment === 'positive')
      ) {
        conflicts.push({
          type: 'sentiment_conflict',
          newContentId: newContent.id,
          existingContentId: existing.id,
          themes: overlappingThemes,
          newSentiment,
          existingSentiment,
          severity: 'high',
        });
      }
    }

    // Check for entity conflicts (same ticker, different sentiment)
    if (newContent.entities && existing.entities) {
      const newTickers = newContent.entities
        .filter(e => e.type === 'ticker')
        .map(e => e.name.toLowerCase());
      const existingTickers = existing.entities
        .filter(e => e.type === 'ticker')
        .map(e => e.name.toLowerCase());

      const overlappingTickers = newTickers.filter(t => existingTickers.includes(t));

      if (overlappingTickers.length > 0 && newSentiment && existingSentiment) {
        if (
          (newSentiment === 'positive' && existingSentiment === 'negative') ||
          (newSentiment === 'negative' && existingSentiment === 'positive')
        ) {
          conflicts.push({
            type: 'ticker_sentiment_conflict',
            newContentId: newContent.id,
            existingContentId: existing.id,
            tickers: overlappingTickers,
            newSentiment,
            existingSentiment,
            severity: 'high',
          });
        }
      }
    }
  });

  return conflicts;
}

/**
 * Get changes since a specific date
 */
export function getChangesSince(content, sinceDate) {
  const since = new Date(sinceDate);
  const recentContent = content.filter(item => {
    const itemDate = new Date(item.date || item.createdAt);
    return itemDate >= since;
  });

  const oldContent = content.filter(item => {
    const itemDate = new Date(item.date || item.createdAt);
    return itemDate < since;
  });

  // Compare themes
  const oldThemes = new Set(oldContent.flatMap(c => c.themes || []));
  const newThemes = new Set(recentContent.flatMap(c => c.themes || []));
  const addedThemes = [...newThemes].filter(t => !oldThemes.has(t));
  const removedThemes = [...oldThemes].filter(t => !newThemes.has(t));

  // Compare sentiment
  const oldSentiment = {
    positive: oldContent.filter(c => c.sentiment === 'positive').length,
    negative: oldContent.filter(c => c.sentiment === 'negative').length,
    neutral: oldContent.filter(c => c.sentiment === 'neutral').length,
  };

  const newSentiment = {
    positive: recentContent.filter(c => c.sentiment === 'positive').length,
    negative: recentContent.filter(c => c.sentiment === 'negative').length,
    neutral: recentContent.filter(c => c.sentiment === 'neutral').length,
  };

  return {
    recentContentCount: recentContent.length,
    oldContentCount: oldContent.length,
    addedThemes,
    removedThemes,
    sentimentShift: {
      positive: newSentiment.positive - oldSentiment.positive,
      negative: newSentiment.negative - oldSentiment.negative,
      neutral: newSentiment.neutral - oldSentiment.neutral,
    },
    recentContent,
  };
}
