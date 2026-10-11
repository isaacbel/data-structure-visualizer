/**
 * analytics.ts — Privacy-Friendly Learning Analytics
 * Zero-PII event tracking for educational content optimization.
 * Collects anonymous usage metrics (topic views, searches, study time, quiz completions).
 */

export interface AnalyticsEvent {
  eventType: 'topic_view' | 'search_query' | 'quiz_completed' | 'comparison_viewed'
  topicId?: string
  query?: string
  score?: number
  timestamp: number
}

const STORAGE_KEY = 'ds_learning_analytics_v1'

class LearningAnalytics {
  private events: AnalyticsEvent[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) this.events = JSON.parse(stored)
      } catch (e) {
        this.events = []
      }
    }
  }

  /** Track topic view (anonymous) */
  trackTopicView(topicId: string): void {
    this.recordEvent({
      eventType: 'topic_view',
      topicId,
      timestamp: Date.now(),
    })
  }

  /** Track search query (anonymous) */
  trackSearch(query: string): void {
    if (!query || query.trim().length < 2) return
    this.recordEvent({
      eventType: 'search_query',
      query: query.trim().toLowerCase(),
      timestamp: Date.now(),
    })
  }

  /** Track quiz completion */
  trackQuizCompletion(topicId: string, score: number): void {
    this.recordEvent({
      eventType: 'quiz_completed',
      topicId,
      score,
      timestamp: Date.now(),
    })
  }

  /** Track comparison modal view */
  trackComparisonView(topicId: string): void {
    this.recordEvent({
      eventType: 'comparison_viewed',
      topicId,
      timestamp: Date.now(),
    })
  }

  private recordEvent(event: AnalyticsEvent): void {
    this.events.push(event)
    // Keep max 500 events
    if (this.events.length > 500) {
      this.events = this.events.slice(-500)
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events))
      } catch (e) {
        // Ignore storage quota errors
      }
    }
  }

  /** Get anonymized top viewed topics */
  getTopTopics(limit = 5): Array<{ topicId: string; count: number }> {
    const counts: Record<string, number> = {}
    for (const ev of this.events) {
      if (ev.eventType === 'topic_view' && ev.topicId) {
        counts[ev.topicId] = (counts[ev.topicId] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([topicId, count]) => ({ topicId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }
}

export const analytics = new LearningAnalytics()
