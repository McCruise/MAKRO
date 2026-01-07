import { useState } from 'react';
import { extractText } from '../utils/parser';
import { analyzeSentiment } from '../utils/sentiment';
import EntityTagging from './EntityTagging';
import MacroThemeTagging from './MacroThemeTagging';

export default function ContentForm({ onSubmit, sources = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    sourceId: '',
    source: '', // Fallback for free text
    content: '',
    date: new Date().toISOString().split('T')[0],
    contentType: 'article',
    entities: [],
    themes: [],
    sentiment: 'neutral',
    sentimentConfidence: 0,
    timeframe: '',
    conviction: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAnalyzeSentiment = () => {
    const textToAnalyze = formData.content;
    if (!textToAnalyze.trim()) {
      alert('Please enter content first');
      return;
    }
    const extractedText = extractText(textToAnalyze, formData.contentType);
    const result = analyzeSentiment(extractedText || textToAnalyze);
    setFormData({
      ...formData,
      sentiment: result.sentiment,
      sentimentConfidence: result.confidence,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const extractedText = extractText(formData.content, formData.contentType);
    
    // Auto-analyze sentiment if not set and content exists
    let finalSentiment = formData.sentiment;
    let finalConfidence = formData.sentimentConfidence;
    if (finalSentiment === 'neutral' && finalConfidence === 0 && extractedText) {
      const analysis = analyzeSentiment(extractedText);
      finalSentiment = analysis.sentiment;
      finalConfidence = analysis.confidence;
    }
    
    onSubmit({
      ...formData,
      extractedText,
      sentiment: finalSentiment,
      sentimentConfidence: finalConfidence,
    });

    // Reset form
    setFormData({
      title: '',
      sourceId: '',
      source: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      contentType: 'article',
      entities: [],
      themes: [],
      sentiment: 'neutral',
      sentimentConfidence: 0,
      timeframe: '',
      conviction: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Content</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Fed Rate Cut Expectations"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sourceId" className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              id="sourceId"
              name="sourceId"
              value={formData.sourceId}
              onChange={(e) => {
                setFormData({ ...formData, sourceId: e.target.value, source: '' });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a source...</option>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
            {formData.sourceId === '' && (
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                placeholder="Or enter source name..."
              />
            )}
          </div>

          <div>
            <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="article">Article</option>
              <option value="link">Link</option>
              <option value="file">File</option>
              <option value="tweet">Tweet</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content / Link
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste article text, URL, or content here..."
          />
        </div>

        <EntityTagging
          entities={formData.entities}
          onEntitiesChange={(entities) => setFormData({ ...formData, entities })}
        />

        <MacroThemeTagging
          themes={formData.themes}
          onThemesChange={(themes) => setFormData({ ...formData, themes })}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sentiment" className="block text-sm font-medium text-gray-700 mb-1">
              Sentiment
            </label>
            <div className="flex gap-2">
              <select
                id="sentiment"
                name="sentiment"
                value={formData.sentiment}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="neutral">Neutral</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </select>
              <button
                type="button"
                onClick={handleAnalyzeSentiment}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                title="Auto-analyze sentiment"
              >
                🔍
              </button>
            </div>
            {formData.sentimentConfidence > 0 && (
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${formData.sentimentConfidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{formData.sentimentConfidence}%</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <select
              id="timeframe"
              name="timeframe"
              value={formData.timeframe}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="short-term">Short-term</option>
              <option value="long-term">Long-term</option>
            </select>
          </div>

          <div>
            <label htmlFor="conviction" className="block text-sm font-medium text-gray-700 mb-1">
              Conviction Level
            </label>
            <select
              id="conviction"
              name="conviction"
              value={formData.conviction}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
        >
          Add Content
        </button>
      </form>
    </div>
  );
}
