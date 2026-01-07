/**
 * Extract clean text from input
 * For now, handles plain text. Future: URL fetching, PDF parsing, etc.
 */
export function extractText(input, contentType) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // If it's a URL/link, we'll just return it for now
  // In future milestones, we can fetch and parse the content
  if (contentType === 'link' && (input.startsWith('http://') || input.startsWith('https://'))) {
    return input; // Return URL as-is for now
  }

  // Basic text cleaning
  let text = input
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
    .trim();

  return text;
}

/**
 * Truncate text for preview display
 */
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}
