/**
 * Check if content is relevant for macro outlook tracking
 */
export function isMacroRelevant(text) {
  if (!text || typeof text !== 'string') return false;

  const lowerText = text.toLowerCase();

  // Macro-relevant keywords (high priority)
  const macroKeywords = [
    // Economic indicators
    'macro', 'macroeconomic', 'macroeconomics', 'economic outlook', 'economic forecast',
    'gdp', 'growth', 'recession', 'expansion', 'contraction',
    
    // Central banks & monetary policy
    'federal reserve', 'fed', 'fomc', 'ecb', 'central bank', 'monetary policy',
    'interest rate', 'rate cut', 'rate hike', 'quantitative easing', 'qe',
    'jerome powell', 'inflation target', 'policy rate',
    
    // Inflation & prices
    'inflation', 'deflation', 'disinflation', 'cpi', 'pce', 'price level',
    'inflationary', 'price pressures',
    
    // Employment
    'employment', 'unemployment', 'labor market', 'jobs report', 'nonfarm payrolls',
    'unemployment rate', 'wage growth',
    
    // Fiscal policy
    'fiscal policy', 'government spending', 'budget', 'deficit', 'stimulus',
    'fiscal stimulus',
    
    // Trade & global
    'trade', 'trade war', 'tariffs', 'trade deficit', 'geopolitical', 'sanctions',
    
    // Market outlook
    'market outlook', 'economic forecast', 'economic prediction', 'economic view',
    'outlook', 'forecast', 'prediction', 'view', 'perspective',
    
    // Key macro themes
    'yield curve', 'bond yield', 'treasury', '10-year', '30-year',
    'housing market', 'real estate', 'consumer spending', 'retail sales',
    'corporate earnings', 'profit margins',
  ];

  // Count matches
  let matchCount = 0;
  macroKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) matchCount += matches.length;
  });

  // Consider relevant if at least 2 macro keywords found
  return matchCount >= 2;
}

/**
 * Score content relevance (0-100)
 */
export function scoreMacroRelevance(text) {
  if (!text || typeof text !== 'string') return 0;

  const lowerText = text.toLowerCase();

  // Weighted keywords
  const keywordWeights = {
    // High weight (macro-specific)
    'macro': 10,
    'macroeconomic': 10,
    'economic outlook': 10,
    'economic forecast': 10,
    'federal reserve': 8,
    'fed': 7,
    'fomc': 8,
    'monetary policy': 8,
    'inflation': 7,
    'recession': 8,
    'gdp': 7,
    
    // Medium weight
    'interest rate': 5,
    'rate cut': 6,
    'rate hike': 6,
    'unemployment': 5,
    'labor market': 5,
    'fiscal policy': 5,
    'trade': 4,
    'outlook': 4,
    'forecast': 4,
    
    // Lower weight (context)
    'economic': 2,
    'market': 2,
    'growth': 2,
    'policy': 2,
  };

  let score = 0;
  Object.entries(keywordWeights).forEach(([keyword, weight]) => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length * weight;
    }
  });

  // Normalize to 0-100
  return Math.min(100, score);
}

/**
 * Filter articles by macro relevance
 */
export function filterMacroRelevant(articles, minScore = 30) {
  return articles
    .map(article => {
      const text = `${article.title} ${article.description || ''} ${article.extractedText || ''}`;
      const relevanceScore = scoreMacroRelevance(text);
      return {
        ...article,
        macroRelevanceScore: relevanceScore,
        isMacroRelevant: relevanceScore >= minScore,
      };
    })
    .filter(article => article.isMacroRelevant)
    .sort((a, b) => b.macroRelevanceScore - a.macroRelevanceScore);
}
