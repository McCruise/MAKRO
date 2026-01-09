/**
 * Parse RSS XML feed
 */
export function parseRSS(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Failed to parse RSS feed');
  }

  const items = xmlDoc.querySelectorAll('item');
  const articles = [];

  items.forEach(item => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const guid = item.querySelector('guid')?.textContent || link;

    // Parse date
    let date = null;
    if (pubDate) {
      const parsedDate = new Date(pubDate);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split('T')[0];
      }
    }

    // Clean description (remove HTML tags)
    const cleanDescription = description
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();

    if (title && link) {
      articles.push({
        id: `rss-${guid}`,
        title: title.trim(),
        link: link.trim(),
        description: cleanDescription,
        date: date || new Date().toISOString().split('T')[0],
        source: 'RSS Feed',
        contentType: 'article',
        content: link, // Store link as content
        extractedText: cleanDescription,
        fetchedAt: Date.now(),
      });
    }
  });

  return articles;
}

/**
 * Fetch RSS feed with CORS proxy (tries multiple methods)
 */
export async function fetchRSSFeed(feedUrl) {
  // Try multiple CORS proxy services as fallback
  const proxyServices = [
    // Method 1: RSS2JSON API (free, no auth needed for basic use)
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=public&count=20`,
    // Method 2: AllOrigins proxy
    `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`,
    // Method 3: CORS Anywhere (if available)
    `https://cors-anywhere.herokuapp.com/${feedUrl}`,
  ];

  // Try RSS2JSON first (returns JSON, easier to parse)
  try {
    const rss2jsonUrl = proxyServices[0];
    const response = await fetch(rss2jsonUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      // RSS2JSON returns JSON format, convert to our article format
      if (data.status === 'ok' && data.items) {
        return data.items.map(item => {
          // Parse date
          let date = null;
          if (item.pubDate) {
            const parsedDate = new Date(item.pubDate);
            if (!isNaN(parsedDate.getTime())) {
              date = parsedDate.toISOString().split('T')[0];
            }
          }

          // Clean description
          const cleanDescription = (item.description || item.content || '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();

          return {
            id: `rss-${item.guid || item.link}`,
            title: item.title?.trim() || '',
            link: item.link?.trim() || '',
            description: cleanDescription,
            date: date || new Date().toISOString().split('T')[0],
            source: data.feed?.title || 'RSS Feed',
            contentType: 'article',
            content: item.link,
            extractedText: cleanDescription,
            fetchedAt: Date.now(),
          };
        }).filter(article => article.title && article.link);
      }
    }
  } catch (error) {
    console.log('RSS2JSON failed, trying fallback...', error);
  }

  // Fallback: Try AllOrigins proxy
  try {
    const proxyUrl = proxyServices[1];
    const response = await fetch(proxyUrl);
    
    if (response.ok) {
      const data = await response.json();
      const xmlText = data.contents || data;
      
      if (typeof xmlText === 'string') {
        return parseRSS(xmlText);
      }
    }
  } catch (error) {
    console.log('AllOrigins failed, trying direct fetch...', error);
  }

  // Last resort: Try direct fetch (might work for some feeds)
  try {
    const response = await fetch(feedUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });
    
    if (response.ok) {
      const xmlText = await response.text();
      return parseRSS(xmlText);
    }
  } catch (error) {
    console.log('Direct fetch failed', error);
  }

  throw new Error(`Failed to fetch RSS feed from all methods: ${feedUrl}`);
}

/**
 * Fetch multiple RSS feeds
 */
export async function fetchMultipleFeeds(feedUrls) {
  const allArticles = [];
  const errors = [];

  // Fetch all feeds in parallel
  const promises = feedUrls.map(async (url) => {
    try {
      const articles = await fetchRSSFeed(url);
      return { url, articles, error: null };
    } catch (error) {
      return { url, articles: [], error: error.message };
    }
  });

  const results = await Promise.all(promises);

  results.forEach(result => {
    if (result.error) {
      errors.push({ url: result.url, error: result.error });
    } else {
      allArticles.push(...result.articles);
    }
  });

  // Remove duplicates based on link
  const uniqueArticles = [];
  const seenLinks = new Set();

  allArticles.forEach(article => {
    if (!seenLinks.has(article.link)) {
      seenLinks.add(article.link);
      uniqueArticles.push(article);
    }
  });

  // Sort by date (newest first)
  uniqueArticles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return {
    articles: uniqueArticles,
    errors,
  };
}

/**
 * Predefined RSS feed sources
 * Focused on macro outlook and economic analysis
 */
export const RSS_SOURCES = [
  // Central Banks (most relevant for macro)
  {
    id: 'fed',
    name: 'Federal Reserve Press Releases',
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
    category: 'Central Bank',
    priority: 'high',
  },
  {
    id: 'ecb',
    name: 'ECB Press Releases',
    url: 'https://www.ecb.europa.eu/rss/press.html',
    category: 'Central Bank',
    priority: 'high',
  },
  {
    id: 'boe',
    name: 'Bank of England',
    url: 'https://www.bankofengland.co.uk/rss/news',
    category: 'Central Bank',
    priority: 'high',
  },
  
  // Economic News & Analysis
  {
    id: 'reuters-business',
    name: 'Reuters Business',
    url: 'https://feeds.reuters.com/reuters/businessNews',
    category: 'Business',
    priority: 'high',
  },
  {
    id: 'reuters-markets',
    name: 'Reuters Markets',
    url: 'https://feeds.reuters.com/reuters/marketsNews',
    category: 'Markets',
    priority: 'medium',
  },
  {
    id: 'reuters-economy',
    name: 'Reuters Economy',
    url: 'https://feeds.reuters.com/reuters/businessNews',
    category: 'Economy',
    priority: 'high',
  },
  
  // Financial News with Macro Focus
  {
    id: 'ft-markets',
    name: 'Financial Times Markets',
    url: 'https://www.ft.com/markets?format=rss',
    category: 'Markets',
    priority: 'high',
  },
  {
    id: 'wsj-markets',
    name: 'WSJ Markets',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    category: 'Markets',
    priority: 'medium',
  },
  {
    id: 'bloomberg-economics',
    name: 'Bloomberg Economics',
    url: 'https://feeds.bloomberg.com/markets/news.rss',
    category: 'Economics',
    priority: 'high',
  },
  
  // Economic Data & Analysis
  {
    id: 'marketwatch-economy',
    name: 'MarketWatch Economy',
    url: 'https://www.marketwatch.com/rss/topstories',
    category: 'Economy',
    priority: 'medium',
  },
  {
    id: 'cnbc-economy',
    name: 'CNBC Economy',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: 'Economy',
    priority: 'medium',
  },
  
  // Alternative Sources
  {
    id: 'seeking-alpha',
    name: 'Seeking Alpha Macro',
    url: 'https://seekingalpha.com/feed.xml',
    category: 'Analysis',
    priority: 'medium',
  },
];
