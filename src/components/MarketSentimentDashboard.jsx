import SentimentChart from './SentimentChart';
import SentimentSummaryCards from './SentimentSummaryCards';
import MarketMoodIndicator from './MarketMoodIndicator';
import MostMentioned from './MostMentioned';
import NarrativeTimeline from './NarrativeTimeline';
import ConflictDetection from './ConflictDetection';
import ComparisonView from './ComparisonView';

export default function MarketSentimentDashboard({ content }) {
  const themes = [...new Set(content.flatMap(c => c.themes || []))];

  return (
    <div className="space-y-6">
      {/* Top Row: Market Mood & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MarketMoodIndicator content={content} />
        </div>
        <div className="lg:col-span-2">
          <SentimentSummaryCards content={content} />
        </div>
      </div>

      {/* Sentiment Chart */}
      <SentimentChart content={content} />

      {/* Most Mentioned */}
      <MostMentioned content={content} />

      {/* Timeline and Conflicts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NarrativeTimeline content={content} themes={themes} />
        <ConflictDetection content={content} />
      </div>

      {/* Comparison View */}
      <ComparisonView content={content} />
    </div>
  );
}
