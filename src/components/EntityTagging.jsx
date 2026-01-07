import { useState } from 'react';

const ENTITY_TYPES = {
  person: { label: 'Person', color: 'bg-blue-100 text-blue-800' },
  institution: { label: 'Institution', color: 'bg-green-100 text-green-800' },
  ticker: { label: 'Ticker', color: 'bg-purple-100 text-purple-800' },
  sector: { label: 'Sector', color: 'bg-orange-100 text-orange-800' },
  theme: { label: 'Theme', color: 'bg-pink-100 text-pink-800' },
};

export default function EntityTagging({ entities = [], onEntitiesChange }) {
  const [newEntity, setNewEntity] = useState({ name: '', type: 'person' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddEntity = (e) => {
    e.preventDefault();
    if (!newEntity.name.trim()) return;

    const entity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newEntity.name.trim(),
      type: newEntity.type,
    };

    onEntitiesChange([...entities, entity]);
    setNewEntity({ name: '', type: 'person' });
    setShowAddForm(false);
  };

  const handleRemoveEntity = (entityId) => {
    onEntitiesChange(entities.filter(e => e.id !== entityId));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Entities (People, Institutions, Tickers, Sectors, Themes)
        </label>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add Entity'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddEntity} className="flex gap-2 mb-2">
          <input
            type="text"
            value={newEntity.name}
            onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
            placeholder="Entity name..."
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={newEntity.type}
            onChange={(e) => setNewEntity({ ...newEntity, type: e.target.value })}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {Object.entries(ENTITY_TYPES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Add
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {entities.map((entity) => (
          <span
            key={entity.id}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${ENTITY_TYPES[entity.type]?.color || ENTITY_TYPES.person.color}`}
          >
            {entity.name}
            <button
              type="button"
              onClick={() => handleRemoveEntity(entity.id)}
              className="ml-1 hover:text-red-600"
            >
              ×
            </button>
          </span>
        ))}
        {entities.length === 0 && !showAddForm && (
          <span className="text-sm text-gray-500">No entities tagged yet</span>
        )}
      </div>
    </div>
  );
}
