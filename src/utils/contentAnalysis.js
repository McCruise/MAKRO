import { analyzeSentiment } from './sentiment';

/**
 * Extract timeframe from text
 */
export function extractTimeframe(text) {
  if (!text || typeof text !== 'string') return '';

  const lowerText = text.toLowerCase();

  // Long-term indicators
  const longTermKeywords = [
    'long-term', 'long term', 'over the next year', 'next year', 'in 2025', 'in 2026',
    'over the coming year', 'next 12 months', 'next 18 months', 'next 24 months',
    'over the next few years', 'years ahead', 'longer-term', 'longer term',
    'sustained', 'structural', 'secular', 'permanent', 'enduring'
  ];

  // Short-term indicators
  const shortTermKeywords = [
    'short-term', 'short term', 'near-term', 'near term', 'immediate', 'in the coming weeks',
    'next few weeks', 'next few months', 'in the next quarter', 'next quarter',
    'over the next month', 'next month', 'this quarter', 'current quarter',
    'temporary', 'transitory', 'near-term', 'immediate term'
  ];

  let longTermCount = 0;
  let shortTermCount = 0;

  longTermKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) longTermCount += matches.length;
  });

  shortTermKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) shortTermCount += matches.length;
  });

  if (longTermCount > shortTermCount && longTermCount > 0) {
    return 'long-term';
  } else if (shortTermCount > longTermCount && shortTermCount > 0) {
    return 'short-term';
  }

  return '';
}

/**
 * Extract macro themes from text
 */
export function extractMacroThemes(text) {
  if (!text || typeof text !== 'string') return [];

  const lowerText = text.toLowerCase();
  const themes = [];

  // Theme patterns with keywords
  const themePatterns = {
    'Inflation': [
      'inflation', 'cpi', 'consumer price index', 'price level', 'price pressures',
      'deflation', 'disinflation', 'inflationary', 'inflationary pressures',
      'core inflation', 'headline inflation', 'pce', 'personal consumption'
    ],
    'Fed Policy': [
      'federal reserve', 'fed', 'fomc', 'interest rate', 'rate cut', 'rate hike',
      'monetary policy', 'quantitative easing', 'qe', 'tapering', 'balance sheet',
      'jerome powell', 'fed chair', 'federal funds rate', 'fed meeting'
    ],
    'Interest Rates': [
      'interest rate', 'yield', 'treasury', 'bond yield', '10-year', '30-year',
      'rate cut', 'rate hike', 'rate increase', 'rate decrease', 'basis points',
      'yield curve', 'inverted yield', 'fed funds'
    ],
    'Recession': [
      'recession', 'economic downturn', 'economic contraction', 'gdp decline',
      'negative growth', 'economic slowdown', 'bear market', 'economic crisis'
    ],
    'GDP Growth': [
      'gdp', 'gross domestic product', 'economic growth', 'growth rate',
      'economic expansion', 'gdp growth', 'economic output'
    ],
    'Employment': [
      'employment', 'unemployment', 'job market', 'labor market', 'jobs report',
      'nonfarm payrolls', 'unemployment rate', 'jobless claims', 'hiring',
      'layoffs', 'wage growth', 'labor force'
    ],
    'Monetary Policy': [
      'monetary policy', 'central bank', 'policy rate', 'policy stance',
      'accommodative', 'restrictive', 'hawkish', 'dovish'
    ],
    'Fiscal Policy': [
      'fiscal policy', 'government spending', 'budget', 'deficit', 'surplus',
      'stimulus', 'fiscal stimulus', 'tax policy', 'government debt'
    ],
    'Trade': [
      'trade', 'trade war', 'tariffs', 'trade deficit', 'trade surplus',
      'imports', 'exports', 'trade policy', 'trade agreement'
    ],
    'Geopolitics': [
      'geopolitical', 'geopolitics', 'sanctions', 'war', 'conflict',
      'tensions', 'diplomatic', 'international relations'
    ],
    'Energy': [
      'oil', 'crude', 'energy prices', 'gasoline', 'natural gas', 'energy market',
      'opec', 'energy crisis', 'energy supply'
    ],
    'Technology': [
      'tech', 'technology', 'ai', 'artificial intelligence', 'tech stocks',
      'innovation', 'digital', 'semiconductors', 'tech sector'
    ],
    'Housing': [
      'housing', 'real estate', 'home prices', 'housing market', 'mortgage',
      'housing starts', 'home sales', 'real estate market'
    ],
    'Consumer Spending': [
      'consumer spending', 'retail sales', 'consumer confidence', 'consumer sentiment',
      'retail', 'consumption', 'consumer demand'
    ],
    'Corporate Earnings': [
      'earnings', 'corporate earnings', 'profit', 'revenue', 'earnings season',
      'corporate profits', 'company earnings'
    ],
  };

  Object.entries(themePatterns).forEach(([theme, keywords]) => {
    let matchCount = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) matchCount += matches.length;
    });

    // Add theme if found at least once
    if (matchCount > 0) {
      themes.push(theme);
    }
  });

  // Remove duplicates and return
  return [...new Set(themes)];
}

/**
 * Analyze content comprehensively
 */
export function analyzeContent(text) {
  if (!text || typeof text !== 'string') {
    return {
      sentiment: 'neutral',
      sentimentConfidence: 0,
      timeframe: '',
      themes: [],
    };
  }

  const sentiment = analyzeSentiment(text);
  const timeframe = extractTimeframe(text);
  const themes = extractMacroThemes(text);

  return {
    sentiment: sentiment.sentiment,
    sentimentConfidence: sentiment.confidence,
    timeframe,
    themes,
  };
}
