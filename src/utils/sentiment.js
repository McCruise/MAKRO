/**
 * Basic sentiment analysis using keyword matching
 * Returns: { sentiment: 'positive'|'negative'|'neutral', confidence: 0-100 }
 */
export function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') {
    return { sentiment: 'neutral', confidence: 0 };
  }

  const lowerText = text.toLowerCase();

  // Positive keywords
  const positiveKeywords = [
    'bullish', 'bull', 'growth', 'optimistic', 'positive', 'strong', 'rally',
    'surge', 'gain', 'rise', 'increase', 'improve', 'recovery', 'rebound',
    'outperform', 'buy', 'upgrade', 'beat', 'exceed', 'outperform', 'momentum',
    'opportunity', 'upside', 'favorable', 'supportive', 'constructive'
  ];

  // Negative keywords
  const negativeKeywords = [
    'bearish', 'bear', 'decline', 'pessimistic', 'negative', 'weak', 'crash',
    'drop', 'fall', 'decrease', 'worsen', 'recession', 'crisis', 'collapse',
    'underperform', 'sell', 'downgrade', 'miss', 'disappoint', 'risk',
    'concern', 'worry', 'threat', 'challenge', 'headwind', 'pressure'
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\w*`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });

  negativeKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\w*`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });

  // Calculate sentiment
  const total = positiveCount + negativeCount;
  let sentiment = 'neutral';
  let confidence = 0;

  if (total === 0) {
    sentiment = 'neutral';
    confidence = 0;
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = Math.min(100, Math.round((positiveCount / total) * 100));
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = Math.min(100, Math.round((negativeCount / total) * 100));
  } else {
    sentiment = 'neutral';
    confidence = 50;
  }

  // Boost confidence if there are many signals
  if (total >= 5) {
    confidence = Math.min(100, confidence + 10);
  }

  return { sentiment, confidence };
}

/**
 * Aggregate sentiment by asset/ticker
 */
export function aggregateSentimentByAsset(content, assetName) {
  const relevantContent = content.filter(item => {
    if (!item.entities) return false;
    return item.entities.some(e => 
      e.type === 'ticker' && e.name.toLowerCase() === assetName.toLowerCase()
    );
  });

  if (relevantContent.length === 0) {
    return { sentiment: 'neutral', confidence: 0, count: 0 };
  }

  const sentiments = relevantContent
    .filter(item => item.sentiment)
    .map(item => item.sentiment);

  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const negativeCount = sentiments.filter(s => s === 'negative').length;
  const neutralCount = sentiments.filter(s => s === 'neutral').length;

  let aggregatedSentiment = 'neutral';
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    aggregatedSentiment = 'positive';
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    aggregatedSentiment = 'negative';
  }

  const confidence = Math.round(
    (Math.max(positiveCount, negativeCount) / sentiments.length) * 100
  );

  return {
    sentiment: aggregatedSentiment,
    confidence,
    count: relevantContent.length,
    breakdown: { positive: positiveCount, negative: negativeCount, neutral: neutralCount }
  };
}

/**
 * Aggregate sentiment by theme
 */
export function aggregateSentimentByTheme(content, themeName) {
  const relevantContent = content.filter(item => {
    if (!item.entities) return false;
    return item.entities.some(e => 
      e.type === 'theme' && e.name.toLowerCase() === themeName.toLowerCase()
    );
  });

  if (relevantContent.length === 0) {
    return { sentiment: 'neutral', confidence: 0, count: 0 };
  }

  const sentiments = relevantContent
    .filter(item => item.sentiment)
    .map(item => item.sentiment);

  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const negativeCount = sentiments.filter(s => s === 'negative').length;
  const neutralCount = sentiments.filter(s => s === 'neutral').length;

  let aggregatedSentiment = 'neutral';
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    aggregatedSentiment = 'positive';
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    aggregatedSentiment = 'negative';
  }

  const confidence = Math.round(
    (Math.max(positiveCount, negativeCount) / sentiments.length) * 100
  );

  return {
    sentiment: aggregatedSentiment,
    confidence,
    count: relevantContent.length,
    breakdown: { positive: positiveCount, negative: negativeCount, neutral: neutralCount }
  };
}
