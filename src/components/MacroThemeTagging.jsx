import { useState } from 'react';

const COMMON_THEMES = [
  'Inflation',
  'Fed Policy',
  'Interest Rates',
  'Recession',
  'GDP Growth',
  'Employment',
  'Monetary Policy',
  'Fiscal Policy',
  'Trade',
  'Geopolitics',
  'Energy',
  'Technology',
  'Housing',
  'Consumer Spending',
  'Corporate Earnings',
];

export default function MacroThemeTagging({ themes = [], onThemesChange }) {
  const [newTheme, setNewTheme] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTheme = (theme) => {
    if (!theme.trim() || themes.includes(theme.trim())) return;

    onThemesChange([...themes, theme.trim()]);
    setNewTheme('');
    setShowAddForm(false);
  };

  const handleRemoveTheme = (themeToRemove) => {
    onThemesChange(themes.filter(t => t !== themeToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Macro Themes
        </label>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add Theme'}
        </button>
      </div>

      {showAddForm && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTheme(newTheme);
                }
              }}
              placeholder="Enter theme name..."
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="button"
              onClick={() => handleAddTheme(newTheme)}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add
            </button>
          </div>
          <div className="text-xs text-gray-500 mb-2">Common themes:</div>
          <div className="flex flex-wrap gap-2">
            {COMMON_THEMES.filter(t => !themes.includes(t)).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => handleAddTheme(theme)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                + {theme}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <span
            key={theme}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
          >
            {theme}
            <button
              type="button"
              onClick={() => handleRemoveTheme(theme)}
              className="ml-1 hover:text-red-600"
            >
              ×
            </button>
          </span>
        ))}
        {themes.length === 0 && !showAddForm && (
          <span className="text-sm text-gray-500">No themes tagged yet</span>
        )}
      </div>
    </div>
  );
}
