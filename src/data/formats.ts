import type { Color, EventFormat } from '../types';

export const FORMATS: EventFormat[] = [
  'Premier Draft',
  'Traditional Draft',
  'Sealed',
  'Traditional Sealed',
  'Quick Draft',
  'Phantom Draft',
  'Cube Draft',
  'PickTwoDraft',
  'Contender Draft',
  'Direct Draft',
];

export const COLORS: Color[] = ['W', 'U', 'B', 'R', 'G'];

export const COLOR_NAMES: Record<Color, string> = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
};

export const TROPHY_WINS: Record<EventFormat, number> = {
  'Premier Draft': 7,
  'Traditional Draft': 3, // 3-0, plays fixed 3 rounds
  'Sealed': 7,
  'Traditional Sealed': 4,
  'Quick Draft': 7,
  'Phantom Draft': 7,
  'Cube Draft': 7,
  'PickTwoDraft': 4, // 4-0
  'Contender Draft': 7,
  'Direct Draft': 7,
};

export const MAX_LOSSES: Record<EventFormat, number> = {
  'Premier Draft': 3,
  'Traditional Draft': 3, // fixed 3 rounds — 0-3 is valid
  'Sealed': 3,
  'Traditional Sealed': 1,
  'Quick Draft': 3,
  'Phantom Draft': 3,
  'Cube Draft': 3,
  'PickTwoDraft': 2,
  'Contender Draft': 3,
  'Direct Draft': 2,
};

export const MAX_WINS: Record<EventFormat, number> = {
  'Premier Draft': 7,
  'Traditional Draft': 3,
  'Sealed': 7,
  'Traditional Sealed': 4,
  'Quick Draft': 7,
  'Phantom Draft': 7,
  'Cube Draft': 7,
  'PickTwoDraft': 4,
  'Contender Draft': 7,
  'Direct Draft': 7,
};

const FORMAT_ABBR: Record<EventFormat, string> = {
  'Premier Draft': 'Premier',
  'Traditional Draft': 'Trad Draft',
  'Sealed': 'Sealed',
  'Traditional Sealed': 'Trad Sealed',
  'Quick Draft': 'Quick',
  'Phantom Draft': 'Phantom',
  'Cube Draft': 'Cube',
  'PickTwoDraft': 'Pick Two',
  'Contender Draft': 'Contender',
  'Direct Draft': 'Direct',
};

export function formatAbbr(format: EventFormat): string {
  return FORMAT_ABBR[format] ?? format;
}

export const RANKS = [
  'Bronze-4', 'Bronze-3', 'Bronze-2', 'Bronze-1',
  'Silver-4', 'Silver-3', 'Silver-2', 'Silver-1',
  'Gold-4', 'Gold-3', 'Gold-2', 'Gold-1',
  'Platinum-4', 'Platinum-3', 'Platinum-2', 'Platinum-1',
  'Diamond-4', 'Diamond-3', 'Diamond-2', 'Diamond-1',
  'Mythic',
];
