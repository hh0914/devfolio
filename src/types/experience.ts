export interface TimelineItem {
  id: string;
  type: 'work' | 'education';
  title: string;
  org: string;
  /** YYYY-MM */
  start: string;
  end: string | 'present';
  location?: string;
  summary?: string;
  highlights?: string[];
  tags?: string[];
}
