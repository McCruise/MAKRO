import { useState, useEffect } from 'react';
import ContentForm from './components/ContentForm';
import ContentGrid from './components/ContentGrid';
import ContentDetail from './components/ContentDetail';
import ContentFilters from './components/ContentFilters';
import SourceForm from './components/SourceForm';
import SourceList from './components/SourceList';
import KnowledgeGraph from './components/KnowledgeGraph';
import SentimentAggregation from './components/SentimentAggregation';
import NarrativeClusters from './components/NarrativeClusters';
import { loadContent, saveContent, loadSources, saveSources, generateId } from './utils/storage';

function App() {
  const [content, setContent] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [editingSource, setEditingSource] = useState(null);
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [activeView, setActiveView] = useState('content'); // 'content', 'sources', 'graph', 'sentiment', 'clusters'
  const [filterSourceId, setFilterSourceId] = useState('');
  const [filters, setFilters] = useState({
    sentiment: [],
    theme: [],
    timeframe: [],
    conviction: [],
    sourceId: '',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedContent = loadContent();
    const loadedSources = loadSources();
    setContent(loadedContent);
    setSources(loadedSources);
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    if (content.length > 0 || localStorage.getItem('makro_content')) {
      saveContent(content);
    }
  }, [content]);

  // Save to localStorage whenever sources change
  useEffect(() => {
    if (sources.length > 0 || localStorage.getItem('makro_sources')) {
      saveSources(sources);
    }
  }, [sources]);

  const handleAddContent = (formData) => {
    const newContent = {
      id: generateId(),
      ...formData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setContent((prev) => [newContent, ...prev]);
  };

  const handleAddSource = (formData) => {
    if (editingSource) {
      // Update existing source
      setSources((prev) =>
        prev.map((s) =>
          s.id === editingSource.id
            ? { ...s, ...formData, updatedAt: Date.now() }
            : s
        )
      );
      setEditingSource(null);
    } else {
      // Add new source
      const newSource = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSources((prev) => [newSource, ...prev]);
    }
    setShowSourceForm(false);
  };

  const handleEditSource = (source) => {
    setEditingSource(source);
    setShowSourceForm(true);
  };

  const handleSourceClick = (source) => {
    setFilterSourceId(source.id);
    setFilters({ ...filters, sourceId: source.id });
    setActiveView('content');
  };

  const handleCardClick = (contentItem) => {
    setSelectedContent(contentItem);
  };

  const handleCloseDetail = () => {
    setSelectedContent(null);
  };

  // Filter content by all active filters
  const filteredContent = content.filter((item) => {
    // Source filter
    if (filterSourceId && item.sourceId !== filterSourceId) return false;
    if (filters.sourceId && item.sourceId !== filters.sourceId) return false;

    // Sentiment filter
    if (filters.sentiment && filters.sentiment.length > 0) {
      if (!item.sentiment || !filters.sentiment.includes(item.sentiment)) return false;
    }

    // Theme filter
    if (filters.theme && filters.theme.length > 0) {
      if (!item.themes || !filters.theme.some(t => item.themes.includes(t))) return false;
    }

    // Timeframe filter
    if (filters.timeframe && filters.timeframe.length > 0) {
      if (!item.timeframe || !filters.timeframe.includes(item.timeframe)) return false;
    }

    // Conviction filter
    if (filters.conviction && filters.conviction.length > 0) {
      if (!item.conviction || !filters.conviction.includes(item.conviction)) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Macro Outlook Tracker</h1>
          <p className="mt-2 text-gray-600">Track and analyze macro economic narratives</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => {
                setActiveView('content');
                setFilterSourceId('');
                setFilters({ ...filters, sourceId: '' });
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeView === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Content
              {(filterSourceId || (filters.sentiment && filters.sentiment.length > 0) || (filters.theme && filters.theme.length > 0)) && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Filtered
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('sentiment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeView === 'sentiment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sentiment
            </button>
            <button
              onClick={() => setActiveView('clusters')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeView === 'clusters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clusters
            </button>
            <button
              onClick={() => setActiveView('sources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeView === 'sources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setActiveView('graph')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeView === 'graph'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Knowledge Graph
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'content' && (
          <>
            <ContentForm onSubmit={handleAddContent} sources={sources} />
            
            <ContentFilters
              filters={filters}
              onFiltersChange={setFilters}
              content={content}
              sources={sources}
            />

            {(filterSourceId || (filters.sentiment && filters.sentiment.length > 0) || (filters.theme && filters.theme.length > 0)) && (
              <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div>
                  <span className="text-sm text-gray-600">Showing {filteredContent.length} of {content.length} items</span>
                </div>
                <button
                  onClick={() => {
                    setFilterSourceId('');
                    setFilters({ sentiment: [], theme: [], timeframe: [], conviction: [], sourceId: '' });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            <ContentGrid content={filteredContent} onCardClick={handleCardClick} />
          </>
        )}

        {activeView === 'sentiment' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sentiment Aggregation</h2>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveView('sentiment-assets')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  View by Assets
                </button>
                <button
                  onClick={() => setActiveView('sentiment-themes')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  View by Themes
                </button>
              </div>
              <p className="text-gray-600">Select a view above to see sentiment aggregated by assets (tickers) or macro themes.</p>
            </div>
          </div>
        )}

        {activeView === 'sentiment-assets' && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveView('sentiment')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Sentiment
            </button>
            <SentimentAggregation content={content} view="assets" />
          </div>
        )}

        {activeView === 'sentiment-themes' && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveView('sentiment')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Sentiment
            </button>
            <SentimentAggregation content={content} view="themes" />
          </div>
        )}

        {activeView === 'clusters' && (
          <NarrativeClusters content={content} onCardClick={handleCardClick} />
        )}

        {activeView === 'sources' && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Sources</h2>
              <button
                onClick={() => {
                  setEditingSource(null);
                  setShowSourceForm(!showSourceForm);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                {showSourceForm ? 'Cancel' : '+ Add Source'}
              </button>
            </div>

            {showSourceForm && (
              <div className="mb-6">
                <SourceForm
                  source={editingSource}
                  onSubmit={handleAddSource}
                  onCancel={() => {
                    setShowSourceForm(false);
                    setEditingSource(null);
                  }}
                />
              </div>
            )}

            <SourceList
              sources={sources}
              content={content}
              onSourceClick={handleSourceClick}
              onEditSource={handleEditSource}
            />
          </>
        )}

        {activeView === 'graph' && (
          <KnowledgeGraph content={content} sources={sources} />
        )}
      </main>

      {selectedContent && (
        <ContentDetail content={selectedContent} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default App;
