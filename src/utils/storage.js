const STORAGE_KEY = 'makro_content';
const SOURCES_KEY = 'makro_sources';

/**
 * Generate a unique ID for content items
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load content from localStorage
 */
export function loadContent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error loading content from storage:', error);
    return [];
  }
}

/**
 * Save content to localStorage
 */
export function saveContent(contentArray) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentArray));
    return true;
  } catch (error) {
    console.error('Error saving content to storage:', error);
    return false;
  }
}

/**
 * Load sources from localStorage
 */
export function loadSources() {
  try {
    const stored = localStorage.getItem(SOURCES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error loading sources from storage:', error);
    return [];
  }
}

/**
 * Save sources to localStorage
 */
export function saveSources(sourcesArray) {
  try {
    localStorage.setItem(SOURCES_KEY, JSON.stringify(sourcesArray));
    return true;
  } catch (error) {
    console.error('Error saving sources to storage:', error);
    return false;
  }
}
