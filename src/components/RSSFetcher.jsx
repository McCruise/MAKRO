import { useState } from 'react';
import { fetchMultipleFeeds, RSS_SOURCES } from '../utils/rssParser';
import { analyzeContent } from '../utils/contentAnalysis';
import { filterMacroRelevant, scoreMacroRelevance } from '../utils/macroContentFilter';

export default function RSSFetcher({ onArticlesFetched, sources }) {
  const [selectedSources, setSelectedSources] = useState(() => {
    // Default to high priority sources
    return RSS_SOURCES.filter(s => s.priority === 'high').map(s => s.id);
  });
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedArticles, setFetchedArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState(new Set());
  const [errors, setErrors] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [filterRelevant, setFilterRelevant] = useState(true);
  const [minRelevanceScore, setMinRelevanceScore] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSourceToggle = (sourceId) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleFetch = async () => {
    if (selectedSources.length === 0) {
      alert('Please select at least one RSS source');
      return;
    }

    setIsFetching(true);
    setErrors([]);
    setFetchedArticles([]);
    setSelectedArticles(new Set());
    setShowResults(false);

    try {
      const feedUrls = RSS_SOURCES
        .filter(s => selectedSources.includes(s.id))
        .map(s => s.url);

      const result = await fetchMultipleFeeds(feedUrls);

      // Analyze content comprehensively (sentiment, timeframe, themes)
      let articlesWithAnalysis = result.articles.map(article => {
        const textToAnalyze = article.extractedText || article.description || article.title || '';
        const analysis = analyzeContent(textToAnalyze);
        const relevanceScore = scoreMacroRelevance(textToAnalyze);
        
        return {
          ...article,
          sentiment: analysis.sentiment,
          sentimentConfidence: analysis.sentimentConfidence,
          timeframe: analysis.timeframe,
          themes: analysis.themes,
          macroRelevanceScore: relevanceScore,
        };
      });

      // Filter by macro relevance if enabled
      if (filterRelevant) {
        articlesWithAnalysis = filterMacroRelevant(articlesWithAnalysis, minRelevanceScore);
      } else {
        // Still sort by relevance even if not filtering
        articlesWithAnalysis.sort((a, b) => b.macroRelevanceScore - a.macroRelevanceScore);
      }

      setFetchedArticles(articlesWithAnalysis);
      setErrors(result.errors);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      setErrors([{ url: 'Multiple feeds', error: error.message }]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleArticleToggle = (articleId) => {
    setSelectedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedArticles.size === fetchedArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(fetchedArticles.map(a => a.id)));
    }
  };

  const handleAddSelected = () => {
    const articlesToAdd = fetchedArticles.filter(a => selectedArticles.has(a.id));
    
    if (articlesToAdd.length === 0) {
      alert('Please select at least one article to add');
      return;
    }

    // Transform RSS articles to content format
    const contentItems = articlesToAdd.map(article => ({
      ...article,
      source: article.source,
      sourceId: '', // No source ID for RSS articles
      contentType: 'article',
      entities: [],
      themes: [],
      timeframe: '',
      conviction: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    onArticlesFetched(contentItems);
    
    // Reset
    setFetchedArticles([]);
    setSelectedArticles(new Set());
    setShowResults(false);
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800',
    };
    return colors[sentiment] || colors.neutral;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Fetch Articles from RSS Feeds</h2>

      {/* Source Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Select RSS Sources ({selectedSources.length} selected)
          </label>
          <button
            onClick={() => {
              // Select high priority sources by default
              const highPriority = RSS_SOURCES.filter(s => s.priority === 'high').map(s => s.id);
              setSelectedSources(highPriority);
            }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Select High Priority
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {RSS_SOURCES.map(source => (
            <label
              key={source.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                source.priority === 'high' ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSources.includes(source.id)}
                onChange={() => handleSourceToggle(source.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900">{source.name}</div>
                  {source.priority === 'high' && (
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded">High</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{source.category}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Options */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterRelevant}
              onChange={(e) => setFilterRelevant(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Filter by Macro Relevance
            </span>
          </label>
        </div>
        {filterRelevant && (
          <div className="ml-6">
            <label className="block text-xs text-gray-600 mb-1">
              Minimum Relevance Score: {minRelevanceScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={minRelevanceScore}
              onChange={(e) => setMinRelevanceScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>All</span>
              <span>Very Relevant</span>
            </div>
          </div>
        )}
      </div>

      {/* Fetch Button */}
      <button
        onClick={handleFetch}
        disabled={isFetching || selectedSources.length === 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isFetching ? 'Fetching Articles...' : `Fetch Articles (${selectedSources.length} sources)`}
      </button>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">Errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error.url}: {error.error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Results */}
      {showResults && fetchedArticles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Fetched {fetchedArticles.length} Articles
            </h3>
            <div className="flex gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedArticles.size === fetchedArticles.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedArticles.size === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
              >
                Add Selected ({selectedArticles.size})
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {fetchedArticles
              .filter(article => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  article.title.toLowerCase().includes(query) ||
                  (article.description || '').toLowerCase().includes(query) ||
                  (article.themes || []).some(theme => theme.toLowerCase().includes(query))
                );
              })
              .map(article => (
              <div
                key={article.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedArticles.has(article.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleArticleToggle(article.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedArticles.has(article.id)}
                        onChange={() => handleArticleToggle(article.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <h4 className="font-semibold text-gray-900">{article.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {article.description || article.extractedText}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                      {article.sentiment && (
                        <>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded ${getSentimentColor(article.sentiment)}`}>
                            {article.sentiment} ({article.sentimentConfidence}%)
                          </span>
                        </>
                      )}
                      {article.timeframe && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                            {article.timeframe}
                          </span>
                        </>
                      )}
                    </div>
                    {article.themes && article.themes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.themes.map((theme, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                    {article.macroRelevanceScore !== undefined && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Relevance:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                          <div
                            className={`h-2 rounded-full ${
                              article.macroRelevanceScore >= 50 ? 'bg-green-500' :
                              article.macroRelevanceScore >= 30 ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${Math.min(100, article.macroRelevanceScore)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{article.macroRelevanceScore}</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-4 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Open →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showResults && fetchedArticles.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800">No articles found. Try selecting different sources.</p>
        </div>
      )}
    </div>
  );
}
