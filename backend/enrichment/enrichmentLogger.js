/**
 * Competitor Enrichment Session Logger
 * 
 * Tracks Playwright execution stages, competitor details, and progress
 * to feed real-time SSE streams back to the frontend.
 */

class EnrichmentLogger {
  constructor() {
    this.logs = [];
    this.status = 'idle'; // idle | starting | extracting_google | extracting_website | extracting_socials | saving | done | error
    this.progress = { current: 0, total: 0 };
    this.currentCompetitor = null;
    this.details = {
      rating: null,
      reviewCount: null,
      websiteFound: false,
      socialsFound: [],
      failures: []
    };
  }

  /**
   * Resets log state.
   */
  reset() {
    this.logs = [];
    this.status = 'idle';
    this.progress = { current: 0, total: 0 };
    this.currentCompetitor = null;
    this.details = {
      rating: null,
      reviewCount: null,
      websiteFound: false,
      socialsFound: [],
      failures: []
    };
  }

  /**
   * Logs an execution message.
   * @param {string} component - Origin component (e.g. "MapsExtractor")
   * @param {string} message - Step description
   * @param {string} type - 'info' | 'warn' | 'error'
   */
  log(component, message, type = 'info') {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${component}] ${message}`;

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

  /**
   * Updates current competitor status and progress indices.
   */
  updateProgress(current, total, competitorName) {
    this.progress = { current, total };
    this.currentCompetitor = competitorName;
    this.log('EnrichmentEngine', `Progress update: ${current}/${total} - Current competitor: "${competitorName}"`);
  }

  /**
   * Updates current details for debugging display.
   */
  updateDetails(details) {
    this.details = {
      ...this.details,
      ...details
    };
  }

  /**
   * Appends a failure code or message to details list.
   */
  logFailure(msg) {
    this.details.failures.push(msg);
    this.log('EnrichmentEngine', `Failure encountered: ${msg}`, 'warn');
  }

  setStatus(status) {
    this.status = status;
    this.log('EnrichmentEngine', `Status changed to: ${status.toUpperCase()}`);
  }

  /**
   * Prepares the response object for SSE payload streaming.
   */
  getPayload() {
    return {
      status: this.status,
      progress: this.progress,
      currentCompetitor: this.currentCompetitor,
      details: this.details,
      logs: this.logs
    };
  }
}

module.exports = EnrichmentLogger;
