import { useState } from 'react';
import { buildNarrativeCards } from '../utils/narrativeIntelligence';
import NarrativeCard from './NarrativeCard';
import NarrativeEvolutionView from './NarrativeEvolutionView';
import SourcePerspectiveView from './SourcePerspectiveView';
import AlertSystem from './AlertSystem';
import TrackRecord from './TrackRecord';

export default function NarrativeIntelligenceView({ content, sources, onContentClick, invalidations, onInvalidationsUpdate }) {
  const [activeTab, setActiveTab] = useState('narratives'); // 'narratives', 'evolution', 'sources', 'alerts', 'trackrecord'

  const narratives = buildNarrativeCards(content, sources);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <nav className="flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('narratives')}
            className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap ${
              activeTab === 'narratives'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Narrative Cards
          </button>
          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap ${
              activeTab === 'evolution'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Evolution
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap ${
              activeTab === 'sources'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Source Perspectives
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('trackrecord')}
            className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap ${
              activeTab === 'trackrecord'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Track Record
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'narratives' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Narrative Cards</h3>
            <p className="text-sm text-gray-600">Visual representation of narratives with thesis, supporting voices, and counter-arguments</p>
          </div>
          {narratives.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-500">No narratives found. Tag content with themes to see narrative cards.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {narratives.map((narrative, index) => (
                <NarrativeCard
                  key={index}
                  narrative={narrative}
                  onContentClick={onContentClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'evolution' && (
        <NarrativeEvolutionView content={content} sources={sources} />
      )}

      {activeTab === 'sources' && (
        <SourcePerspectiveView
          content={content}
          sources={sources}
          onCardClick={onContentClick}
        />
      )}

      {activeTab === 'alerts' && (
        <AlertSystem
          content={content}
          invalidations={invalidations}
          onInvalidationsUpdate={onInvalidationsUpdate}
        />
      )}

      {activeTab === 'trackrecord' && (
        <TrackRecord content={content} />
      )}
    </div>
  );
}
