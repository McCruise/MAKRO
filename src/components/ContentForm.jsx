import { useState } from 'react';
import { extractText } from '../utils/parser';
import EntityTagging from './EntityTagging';

export default function ContentForm({ onSubmit, sources = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    sourceId: '',
    source: '', // Fallback for free text
    content: '',
    date: new Date().toISOString().split('T')[0],
    contentType: 'article',
    entities: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const extractedText = extractText(formData.content, formData.contentType);
    
    onSubmit({
      ...formData,
      extractedText,
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
