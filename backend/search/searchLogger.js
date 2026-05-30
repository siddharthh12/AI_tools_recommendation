/**
 * Search Session Logger
 * 
 * Provides structured tracking of Playwright browser execution steps, 
 * queries, and extraction counts for on-screen debug panel rendering.
 */

class SearchLogger {
  constructor() {
    this.logs = [];
    this.browserStatus = 'idle'; // idle | launching | searching | extracting | closing | done | error
    this.extractionCount = 0;
    this.failedQueries = [];
    this.generatedQueries = [];
  }

  /**
   * Resets the logger for a fresh crawl session.
   */
  reset() {
    this.logs = [];
    this.browserStatus = 'idle';
    this.extractionCount = 0;
    this.failedQueries = [];
    this.generatedQueries = [];
    this.log('System', 'Search logger initialized for a new discovery session.');
  }

  /**
   * Appends an execution log entry.
   * @param {string} component - Origin component (e.g., "Browser", "Cleaner")
   * @param {string} message - Description of the action
   * @param {string} [type] - Optional severity type (e.g. "info", "warn", "error")
   */
  log(component, message, type = 'info') {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${component}] ${message}`;
    
    // Print to server console
    if (type === 'error') {
      console.error(`\x1b[31m${timestamp} ${formattedMessage}\x1b[0m`);
    } else if (type === 'warn') {
      console.warn(`\x1b[33m${timestamp} ${formattedMessage}\x1b[0m`);
    } else {
      console.log(`\x1b[36m${timestamp} ${formattedMessage}\x1b[0m`);
    }

    this.logs.push({
      timestamp,
      component,
      message,
      type
    });
  }

  setBrowserStatus(status) {
    this.browserStatus = status;
    this.log('Browser', `Status updated to: ${status.toUpperCase()}`);
  }

  setQueries(queries) {
    this.generatedQueries = queries;
    this.log('QueryGen', `Generated queries: ${JSON.stringify(queries)}`);
  }

  incrementExtraction(count) {
    this.extractionCount += count;
    this.log('Extractor', `Extracted ${count} real records (Total: ${this.extractionCount})`);
  }

  logQueryFailure(query, error) {
    this.failedQueries.push({ query, error: error.message || error });
    this.log('Scraper', `Failed to crawl query: "${query}" - Error: ${error.message || error}`, 'error');
  }

  /**
   * Retrieves the aggregated session report.
   * @returns {Object} Structured session summary
   */
  getSessionData() {
    return {
      browserStatus: this.browserStatus,
      extractionCount: this.extractionCount,
      generatedQueries: this.generatedQueries,
      failedQueries: this.failedQueries,
      logs: this.logs
    };
  }
}

// Singleton pattern to share the session logs during a single POST request thread safely
const sessionLogger = new SearchLogger();

module.exports = sessionLogger;
