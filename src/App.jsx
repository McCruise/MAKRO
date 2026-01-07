import { useState, useEffect } from 'react';
import ContentForm from './components/ContentForm';
import ContentGrid from './components/ContentGrid';
import ContentDetail from './components/ContentDetail';
import SourceForm from './components/SourceForm';
import SourceList from './components/SourceList';
import KnowledgeGraph from './components/KnowledgeGraph';
import { loadContent, saveContent, loadSources, saveSources, generateId } from './utils/storage';

function App() {
  const [content, setContent] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [editingSource, setEditingSource] = useState(null);
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [activeView, setActiveView] = useState('content'); // 'content', 'sources', 'graph'
  const [filterSourceId, setFilterSourceId] = useState('');

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
    setActiveView('content');
  };

  const handleCardClick = (contentItem) => {
    setSelectedContent(contentItem);
  };

  const handleCloseDetail = () => {
    setSelectedContent(null);
  };

  // Filter content by source
  const filteredContent = filterSourceId
    ? content.filter((item) => item.sourceId === filterSourceId)
    : content;

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
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveView('content');
                setFilterSourceId('');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Content
              {filterSourceId && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Filtered
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('sources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'sources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setActiveView('graph')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
            
            {filterSourceId && (
              <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div>
                  <span className="text-sm text-gray-600">Filtered by source: </span>
                  <span className="font-medium text-gray-900">
                    {sources.find((s) => s.id === filterSourceId)?.name || 'Unknown'}
                  </span>
                </div>
                <button
                  onClick={() => setFilterSourceId('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filter
                </button>
              </div>
            )}

            <ContentGrid content={filteredContent} onCardClick={handleCardClick} />
          </>
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
