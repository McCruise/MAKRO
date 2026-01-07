/**
 * Build narrative cards with thesis, supporting voices, and counter-arguments
 */
export function buildNarrativeCards(content, sources) {
  // Group content by themes to form narratives
  const narrativeMap = new Map();

  content.forEach(item => {
    if (!item.themes || item.themes.length === 0) return;

    item.themes.forEach(theme => {
      if (!narrativeMap.has(theme)) {
        narrativeMap.set(theme, {
          theme,
          items: [],
          supportingVoices: [],
          counterArguments: [],
          consensus: null,
        });
      }

      const narrative = narrativeMap.get(theme);
      narrative.items.push(item);

      // Get source info
      const source = sources.find(s => s.id === item.sourceId);
      const sourceName = source?.name || item.source || 'Unknown';

      // Categorize by sentiment
      if (item.sentiment === 'positive') {
        narrative.supportingVoices.push({
          source: sourceName,
          content: item,
          date: item.date || item.createdAt,
        });
      } else if (item.sentiment === 'negative') {
        narrative.counterArguments.push({
          source: sourceName,
          content: item,
          date: item.date || item.createdAt,
        });
      }
    });
  });

  // Calculate consensus for each narrative
  const narratives = Array.from(narrativeMap.values()).map(narrative => {
    const total = narrative.items.length;
    const positive = narrative.supportingVoices.length;
    const negative = narrative.counterArguments.length;
    const neutral = total - positive - negative;

    let consensus = 'mixed';
    let consensusPercent = 0;

    if (total > 0) {
      const maxCount = Math.max(positive, negative, neutral);
      consensusPercent = (maxCount / total) * 100;

      if (positive === maxCount && consensusPercent >= 70) {
        consensus = 'consensus_positive';
      } else if (negative === maxCount && consensusPercent >= 70) {
        consensus = 'consensus_negative';
      } else if (neutral === maxCount && consensusPercent >= 70) {
        consensus = 'consensus_neutral';
      } else if (consensusPercent >= 50) {
        consensus = positive === maxCount ? 'majority_positive' : 
                   negative === maxCount ? 'majority_negative' : 'majority_neutral';
      } else {
        consensus = 'dissent';
      }
    }

    // Extract thesis from most recent positive content
    const latestSupporting = narrative.supportingVoices
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    const thesis = latestSupporting?.content?.title || 
                   narrative.items[0]?.title || 
                   `Narrative about ${narrative.theme}`;

    return {
      ...narrative,
      thesis,
      consensus,
      consensusPercent,
      total,
      positive,
      negative,
      neutral,
    };
  });

  return narratives;
}

/**
 * Track narrative evolution for a specific theme
 */
export function trackNarrativeEvolution(content, theme, sources) {
  const themeContent = content
    .filter(item => item.themes && item.themes.includes(theme))
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return dateA - dateB;
    });

  const evolution = [];
  let currentSentiment = null;
  let currentPhase = null;
  let phaseStart = null;

  themeContent.forEach((item, index) => {
    const date = new Date(item.date || item.createdAt);
    const source = sources.find(s => s.id === item.sourceId);
    const sourceName = source?.name || item.source || 'Unknown';

    // Detect phase changes
    if (item.sentiment !== currentSentiment) {
      if (currentPhase) {
        evolution.push({
          phase: currentPhase,
          sentiment: currentSentiment,
          startDate: phaseStart,
          endDate: date,
          items: themeContent.slice(
            evolution.reduce((sum, e) => sum + e.items.length, 0),
            index
          ),
        });
      }

      currentSentiment = item.sentiment;
      currentPhase = item.sentiment === 'positive' ? 'bullish' :
                    item.sentiment === 'negative' ? 'bearish' : 'neutral';
      phaseStart = date;
    }

    // Track inflection points
    if (index > 0) {
      const prev = themeContent[index - 1];
      if (prev.sentiment && item.sentiment && prev.sentiment !== item.sentiment) {
        evolution.push({
          type: 'inflection',
          from: prev.sentiment,
          to: item.sentiment,
          date,
          source: sourceName,
          content: item,
        });
      }
    }
  });

  // Add final phase
  if (currentPhase) {
    const startIndex = evolution.reduce((sum, e) => sum + (e.items?.length || 0), 0);
    evolution.push({
      phase: currentPhase,
      sentiment: currentSentiment,
      startDate: phaseStart,
      endDate: new Date(),
      items: themeContent.slice(startIndex),
    });
  }

  return {
    theme,
    evolution,
    totalItems: themeContent.length,
    currentSentiment,
  };
}

/**
 * Get all narratives from a specific source
 */
export function getSourcePerspective(content, sourceId, sources) {
  const sourceContent = content.filter(item => item.sourceId === sourceId);
  const source = sources.find(s => s.id === sourceId);

  const narratives = sourceContent.map(item => ({
    ...item,
    themes: item.themes || [],
    entities: item.entities || [],
  }));

  // Group by theme
  const byTheme = {};
  narratives.forEach(item => {
    item.themes.forEach(theme => {
      if (!byTheme[theme]) {
        byTheme[theme] = [];
      }
      byTheme[theme].push(item);
    });
  });

  return {
    source: source || { name: 'Unknown' },
    totalContent: sourceContent.length,
    narratives,
    byTheme,
    sentimentBreakdown: {
      positive: sourceContent.filter(c => c.sentiment === 'positive').length,
      negative: sourceContent.filter(c => c.sentiment === 'negative').length,
      neutral: sourceContent.filter(c => c.sentiment === 'neutral' || !c.sentiment).length,
    },
  };
}

/**
 * Detect narrative shifts
 */
export function detectNarrativeShifts(content, threshold = 0.3) {
  const shifts = [];

  // Group by theme
  const byTheme = {};
  content.forEach(item => {
    if (item.themes) {
      item.themes.forEach(theme => {
        if (!byTheme[theme]) {
          byTheme[theme] = [];
        }
        byTheme[theme].push(item);
      });
    }
  });

  Object.entries(byTheme).forEach(([theme, items]) => {
    if (items.length < 3) return; // Need at least 3 items to detect shift

    // Sort by date
    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return dateA - dateB;
    });

    // Split into recent and older
    const midpoint = Math.floor(sorted.length / 2);
    const older = sorted.slice(0, midpoint);
    const recent = sorted.slice(midpoint);

    // Calculate sentiment ratios
    const olderPositive = older.filter(i => i.sentiment === 'positive').length / older.length;
    const recentPositive = recent.filter(i => i.sentiment === 'positive').length / recent.length;

    const shift = recentPositive - olderPositive;

    if (Math.abs(shift) >= threshold) {
      shifts.push({
        theme,
        shift: shift > 0 ? 'positive' : 'negative',
        magnitude: Math.abs(shift),
        olderSentiment: olderPositive > 0.5 ? 'positive' : olderPositive < 0.5 ? 'negative' : 'neutral',
        recentSentiment: recentPositive > 0.5 ? 'positive' : recentPositive < 0.5 ? 'negative' : 'neutral',
        olderCount: older.length,
        recentCount: recent.length,
      });
    }
  });

  return shifts;
}

/**
 * Check for narrative invalidations
 */
export function checkInvalidations(content, invalidations = []) {
  const newInvalidations = [];

  content.forEach(item => {
    if (!item.themes) return;

    item.themes.forEach(theme => {
      // Check if this contradicts existing narratives
      const relatedContent = content.filter(c => 
        c.id !== item.id && 
        c.themes && 
        c.themes.includes(theme)
      );

      relatedContent.forEach(related => {
        if (related.sentiment && item.sentiment && 
            related.sentiment !== item.sentiment &&
            related.sentiment !== 'neutral' && 
            item.sentiment !== 'neutral') {
          
          // Check if already invalidated
          const alreadyInvalidated = invalidations.some(inv => 
            inv.contentId === related.id && inv.invalidatedBy === item.id
          );

          if (!alreadyInvalidated) {
            newInvalidations.push({
              contentId: related.id,
              invalidatedBy: item.id,
              theme,
              reason: 'sentiment_contradiction',
              date: item.date || item.createdAt,
            });
          }
        }
      });
    });
  });

  return newInvalidations;
}
