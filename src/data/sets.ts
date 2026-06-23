// ─── MTG Sets ────────────────────────────────────────────────────────────────
// Add new sets here when they release.
// The code is what appears in the app and in your event records.

export interface MtgSet {
  code: string;
  name: string;
}

export const SETS_DATA: MtgSet[] = [
  // ── 2026 ──────────────────────────────────────────────────────────────────
  { code: 'MSH', name: 'Marvel Super Heroes' },
  { code: 'SOS', name: 'Secrets of Strixhaven' },
  { code: 'TMT', name: 'Teenage Mutant Ninja Turtles' },
  { code: 'ECL', name: 'Lorwyn Eclipsed' },

  // ── 2025 ──────────────────────────────────────────────────────────────────
  { code: 'TLA', name: 'Avatar: The Last Airbender' },
  { code: 'OM1', name: 'Through the Omenpaths' },
  { code: 'EOE', name: 'Edge of Eternities' },
  { code: 'FIN', name: 'Final Fantasy' },
  { code: 'TDM', name: 'Tarkir: Dragonstorm' },
  { code: 'DFT', name: 'Aetherdrift' },

  // ── 2024 ──────────────────────────────────────────────────────────────────
  { code: 'FDN', name: 'Foundations' },
  { code: 'DSK', name: 'Duskmourn: House of Horror' },
  { code: 'BLB', name: 'Bloomburrow' },
  { code: 'OTJ', name: 'Outlaws of Thunder Junction' },
  { code: 'MKM', name: 'Murders at Karlov Manor' },

  // ── 2023 ──────────────────────────────────────────────────────────────────
  { code: 'KTK', name: 'Khans of Tarkir' },
  { code: 'LCI', name: 'The Lost Caverns of Ixalan' },
  { code: 'WOE', name: 'Wilds of Eldraine' },
  { code: 'LTR', name: 'The Lord of the Rings: Tales of Middle-earth' },
  { code: 'MOM', name: 'March of the Machine' },
  { code: 'SIR', name: 'Shadows over Innistrad Remastered' },
  { code: 'ONE', name: 'Phyrexia: All Will Be One' },

  // ── 2022 ──────────────────────────────────────────────────────────────────
  { code: 'BRO', name: "The Brothers' War" },
  { code: 'DMU', name: 'Dominaria United' },
  { code: 'SNC', name: 'Streets of New Capenna' },
  { code: 'NEO', name: 'Kamigawa: Neon Dynasty' },

  // ── 2021 ──────────────────────────────────────────────────────────────────
  { code: 'VOW', name: 'Innistrad: Crimson Vow' },
  { code: 'MID', name: 'Innistrad: Midnight Hunt' },
  { code: 'AFR', name: 'Adventures in the Forgotten Realms' },
  { code: 'STX', name: 'Strixhaven: School of Mages' },
  { code: 'KHM', name: 'Kaldheim' },

  // ── 2020 ──────────────────────────────────────────────────────────────────
  { code: 'ZNR', name: 'Zendikar Rising' },
  { code: 'M21', name: 'Core Set 2021' },
  { code: 'IKO', name: 'Ikoria: Lair of Behemoths' },
  { code: 'THB', name: 'Theros Beyond Death' },

  // ── 2019 ──────────────────────────────────────────────────────────────────
  { code: 'ELD', name: 'Throne of Eldraine' },
  { code: 'M20', name: 'Core Set 2020' },
  { code: 'WAR', name: 'War of the Spark' },
  { code: 'RNA', name: 'Ravnica Allegiance' },

  // ── 2018 ──────────────────────────────────────────────────────────────────
  { code: 'GRN', name: 'Guilds of Ravnica' },
  { code: 'M19', name: 'Core Set 2019' },
  { code: 'DAR', name: 'Dominaria' },
  { code: 'RIX', name: 'Rivals of Ixalan' },

  // ── 2017 ──────────────────────────────────────────────────────────────────
  { code: 'XLN', name: 'Ixalan' },
];
