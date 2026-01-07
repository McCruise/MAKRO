# Macro Outlook Tracker

A Narrative Intelligence Platform that aggregates and analyzes macro economic outlooks from various sources (articles, links, files, tweets) to help you track market sentiment and understand evolving narratives. The app parses information from multiple people and institutions, extracts sentiment, and compares it against existing knowledge to form current views on macro trends and specific stocks. It provides visual dashboards showing market sentiment through interactive cards representing different views, people, and institutions, helping you understand consensus, contrarian takes, and how narratives evolve over time. Later phases will surface trade ideas and help identify when narratives are priced in or offer opportunities.

## Tech Stack

- **React** - Frontend framework for building the user interface
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Local Storage** - Client-side data persistence

## Development Milestones

### Milestone 1: Foundation & Data Ingestion
**Goal:** Build the core data input system to accept and store various content types.

**Testable Features:**
- Input form to add new content (title, source, content/link, date, content type: article/link/file/tweet)
- Basic parser to extract clean text from pasted content
- Display added items as cards in a grid/list view
- Data persists in local storage after page refresh
- View content details in expanded card view

### Milestone 2: Entity Extraction & Source Tracking
**Goal:** Track different sources (people, institutions) and extract key entities from content.

**Testable Features:**
- Add/edit person/institution profiles (name, background, type: macro/quant/fundamental)
- Associate content with specific sources
- Manual entity extraction: tag people, institutions, tickers, sectors, and macro themes mentioned in content
- Filter and view content by source
- Visual cards representing each person/institution with their content count and recent activity
- Knowledge graph visualization showing connections between sources → content → entities

### Milestone 3: Sentiment Analysis & Narrative Clustering
**Goal:** Extract sentiment, categorize views, and identify narrative patterns.

**Testable Features:**
- Sentiment scoring per content item (positive/negative/neutral with confidence level)
- Per-asset and per-theme sentiment aggregation
- Manual tagging system for macro themes (e.g., "inflation", "Fed policy", "recession")
- Manual tagging for specific stocks/tickers
- Tag views by timeframe (short-term/long-term) and conviction level
- Narrative clustering: group similar views and detect consensus vs. contrarian takes
- Filter content by sentiment, tags, and narrative clusters

### Milestone 4: Market Sentiment Dashboard & Temporal Tracking
**Goal:** Visual dashboard showing aggregated market sentiment and how narratives evolve over time.

**Testable Features:**
- Sentiment chart/graph showing overall market sentiment over time
- Summary cards showing sentiment breakdown (bullish/bearish/neutral counts) by asset class and theme
- Visual indicators (colors, icons, heatmaps) representing current market mood
- Aggregated view of most mentioned themes and stocks
- Timeline view showing how specific narratives evolved with key inflection points
- Conflict detection: flag when new content contradicts existing narratives
- Comparison view: "What's changed since last week/month?"

### Milestone 5: Narrative Intelligence & Evolution Tracking
**Goal:** Deep dive into narrative analysis, tracking how outlooks evolve and identifying key narrative shifts.

**Testable Features:**
- Narrative cards: visual objects showing a thesis, supporting voices, and counter-arguments
- Consensus tracking: identify when majority of sources agree vs. when there's significant dissent
- Narrative evolution timeline: track how a specific narrative (e.g., "inflation is transitory") changed over time
- Source perspective view: see all narratives from a specific person/institution in one place
- Alert system: notify when narratives shift significantly or get invalidated
- Narrative invalidation tracking: mark when narratives are contradicted by new data or events
- Basic track record: mark whether a narrative played out correctly (for learning, not trading signals)

### Milestone 6: Trade Ideas & Investment Views
**Goal:** Generate and display trade ideas and investment views based on aggregated narratives.

**Testable Features:**
- View showing short-term trade ideas (extracted from content or manually added)
- View showing long-term investment views
- Each idea/view shows: associated sources, sentiment, reasoning, conviction score, and timeframe
- Ability to mark ideas as "active", "completed", or "archived"
- Track record scoring: mark whether narrative/idea played out correctly
- Performance dashboard: track which narratives led to successful outcomes

### Milestone 7: Priced-In Detection & Signal Analysis
**Goal:** Detect if narratives are already reflected in market prices and identify under/overpriced narratives.

**Testable Features:**
- Pricing Score (0-100): multi-signal approach combining consensus saturation, search volume, positioning data
- Consensus Saturation tracker: % of sources expressing the same view (>70% = likely priced in)
- Search/Social Volume tracking: Google Trends, Twitter mentions over time
- Narrative Momentum calculation: (Sentiment Velocity) / (Price Move) / (Positioning Crowding)
- Underpriced narrative detection: emerging from credible minority voices, low volume, price hasn't moved
- Overpriced narrative detection: universal consensus, extreme positioning, price already moved significantly
- Display pricing scores on narrative cards and trade ideas

## Future Enhancements

### Advanced Priced-In Detection Signals
Additional signals for pricing score calculation:

- **Positioning Data Integration**: COT reports, ETF flows, options skew (crowded positioning = priced in)
- **Price-Narrative Divergence**: Narrative bullish but price flat/falling (market doesn't believe it)
- **Volatility Compression**: Implied vol dropping despite "big" narrative (market sees it as known)
- **Time in Discourse**: How long narrative has been circulating (>3-6 months = likely absorbed)

### Market Data Integration
Connect narratives to market reality:

- **Price Data Feeds**: Real-time stock, bond, commodity, FX prices
- **Positioning Data**: COT reports, options flow, fund flows
- **Correlation Engine**: Link narrative shifts to price action
- **Backtest Framework**: How did similar narrative setups perform historically?

### Additional Future Features

- **Automated Web Retrieval**: Scheduled pulls from key sources (Twitter/X, Substack, news APIs)
- **Narrative Comparison Engine**: Compare current narratives to historical periods
- **Source Track Record Dashboard**: Which sources have been most accurate over time?
- **Narrative Archive**: Historical view of all narratives and how they evolved
