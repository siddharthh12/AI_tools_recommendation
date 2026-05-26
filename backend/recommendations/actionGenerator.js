/**
 * Action Checklist Generator
 * 
 * Compiles lists of highly practical, step-by-step optimization tasks
 * for businesses based on the detected weakness category.
 */

const actionChecklists = {
  LOW_MENTIONS: [
    'List your business across high-authority local registries like Yelp, YellowPages, and TripAdvisor.',
    'Encourage brand citation mentions inside localized newsletters and regional business catalogs.',
    'Distribute digital press releases referencing your brand and location keywords to regional media.'
  ],
  POOR_RANKING: [
    'Author detailed, category-specific comparisons between your business and local competitors.',
    'Embed location schemas, map frames, and local address text in your site footer markup.',
    'Synchronize website metadata title tags with active category and city user query variations.'
  ],
  FEW_REVIEWS: [
    'Deploy automated post-service review request invites via text or WhatsApp message.',
    'Add prominent Google Review QR code plaques at checkout registers and storefront counters.',
    'Embed an instant Google Maps review submission link inside digital receipts and emails.'
  ],
  LOW_RATING: [
    'Actively reply to all existing critical customer reviews on Google Maps to resolve issues.',
    'Establish rapid response feedback loops for customers filing less than 4-star reviews.',
    'Implement a service quality checklist and train team members on key customer touchpoints.'
  ],
  MISSING_FAQ: [
    'Incorporate dedicated FAQ blocks detailing membership fees, trial passes, and location queries.',
    'Inject conversational question-answer FAQPage JSON-LD schema markup into site header code.',
    'Format website copy headings to match search questions (e.g., "What are the fees...").'
  ],
  WEAK_AUTHORITY: [
    'Partner with local business blogs and regional news hubs to secure backlink referrals.',
    'Verify active SSL (HTTPS) encryption certificates are enabled on all domain hosting paths.',
    'Configure clean, keyword-optimized SEO Meta description tags inside page headers.'
  ],
  WEAK_COMMUNITY_SIGNALS: [
    'Publish helpful, organic answers in local subreddit discussions (e.g. city community forums).',
    'Share brand milestones, community events, and customer success stories inside local Quora/Reddit boards.',
    'Host or sponsor localized community discussions to naturally expand organic forum citations.'
  ]
};

/**
 * Returns the actionable next steps for a weakness category.
 * @param {string} type - Weakness key
 * @returns {Array<string>} List of checklists actions
 */
const getActions = (type) => {
  return actionChecklists[type] || [
    'Analyze competitor search signals in detail.',
    'Monitor local business review forums daily.',
    'Improve website structure and copy relevance.'
  ];
};

module.exports = {
  getActions,
  actionChecklists
};
