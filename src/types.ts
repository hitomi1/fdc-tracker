export type Color = 'W' | 'U' | 'B' | 'R' | 'G';

export type EventFormat =
  | 'Premier Draft'
  | 'Traditional Draft'
  | 'Sealed'
  | 'Traditional Sealed'
  | 'Quick Draft'
  | 'Phantom Draft'
  | 'Cube Draft'
  | 'PickTwoDraft'
  | 'Contender Draft'
  | 'Direct Draft';

export interface DraftEvent {
  id: string;
  date: string;
  format: EventFormat;
  set: string;
  wins: number;
  losses: number;
  /** Legacy field from the original app — superseded by mainColors */
  colors?: Color[];
  mainColors?: Color[];
  splashColors?: Color[];
  startRank?: string;
  endRank?: string;
  notes?: string;
  deckCode?: string;
}

export interface Filters {
  format: string;
  set: string;
  dateFrom: string;
  dateTo: string;
}

export type SortColumn = 'date' | 'set' | 'wins' | 'format';

export interface SortState {
  col: SortColumn;
  dir: 'asc' | 'desc';
}

export type Tab = 'events' | 'performance' | 'rewards';
