// ─── Rewards Table ────────────────────────────────────────────────────────────
// Full reward data per format and record.
// Fields:
//   stdReward  — total prize value in gems (packs converted at market rate)
//   netStd     — stdReward minus entry cost
//   netGem     — direct gems earned minus entry cost (no pack value)
//   netPct     — stdReward / cost as %  ("% of entry recovered")
//   mythicPacks, normalPacks, gems, usd — raw prize breakdown
//
// To update: edit rows below or add new format blocks.

export type RewardFormatKey =
  | 'Contender'
  | 'Direct'
  | 'Pick2'
  | 'Premier'
  | 'Quick'
  | 'Traditional';

export interface RewardRow {
  format: RewardFormatKey;
  cost: number;
  wins: string;
  winrate: string;
  stdReward: number;
  netStd: number;
  netGem: number;
  netPct: string;
  mythicPacks: number;
  normalPacks: number;
  gems: number;
  usd: number;
}

export const REWARDS_TABLE: RewardRow[] = [
  // ── Contender (3000 gems) ──────────────────────────────────────────────────
  { format: 'Contender', cost: 3000, wins: '0-3', winrate: '0%',      stdReward: 400,   netStd: -2600, netGem: -3000, netPct: '13.33%',  mythicPacks: 0,  normalPacks: 0,  gems: 0,     usd: 0    },
  { format: 'Contender', cost: 3000, wins: '1-3', winrate: '25%',     stdReward: 400,   netStd: -2600, netGem: -3000, netPct: '13.33%',  mythicPacks: 0,  normalPacks: 0,  gems: 0,     usd: 0    },
  { format: 'Contender', cost: 3000, wins: '2-3', winrate: '40%',     stdReward: 400,   netStd: -2600, netGem: -3000, netPct: '13.33%',  mythicPacks: 0,  normalPacks: 0,  gems: 0,     usd: 0    },
  { format: 'Contender', cost: 3000, wins: '3-3', winrate: '50%',     stdReward: 2400,  netStd: -600,  netGem: -1600, netPct: '80%',     mythicPacks: 0,  normalPacks: 3,  gems: 1400,  usd: 7    },
  { format: 'Contender', cost: 3000, wins: '4-3', winrate: '57.14%',  stdReward: 4400,  netStd: 1400,  netGem: -200,  netPct: '146.67%', mythicPacks: 0,  normalPacks: 6,  gems: 2800,  usd: 14   },
  { format: 'Contender', cost: 3000, wins: '5-3', winrate: '62.5%',   stdReward: 5200,  netStd: 2200,  netGem: 200,   netPct: '173.33%', mythicPacks: 0,  normalPacks: 8,  gems: 3200,  usd: 16   },
  { format: 'Contender', cost: 3000, wins: '6-3', winrate: '66.67%',  stdReward: 7640,  netStd: 4640,  netGem: 1200,  netPct: '254.67%', mythicPacks: 4,  normalPacks: 10, gems: 4200,  usd: 21   },
  { format: 'Contender', cost: 3000, wins: '7-0', winrate: '100%',    stdReward: 12600, netStd: 9600,  netGem: 4200,  netPct: '420%',    mythicPacks: 10, normalPacks: 12, gems: 7200,  usd: 36   },
  { format: 'Contender', cost: 3000, wins: '7-1', winrate: '87.5%',   stdReward: 12600, netStd: 9600,  netGem: 4200,  netPct: '420%',    mythicPacks: 10, normalPacks: 12, gems: 7200,  usd: 36   },
  { format: 'Contender', cost: 3000, wins: '7-2', winrate: '77.78%',  stdReward: 12600, netStd: 9600,  netGem: 4200,  netPct: '420%',    mythicPacks: 10, normalPacks: 12, gems: 7200,  usd: 36   },

  // ── Direct (6000 gems) ─────────────────────────────────────────────────────
  { format: 'Direct', cost: 6000, wins: '0-2', winrate: '0%',      stdReward: 1200,  netStd: -4800, netGem: -6000, netPct: '20%',     mythicPacks: 0, normalPacks: 6,  gems: 0,     usd: 0    },
  { format: 'Direct', cost: 6000, wins: '1-2', winrate: '33.33%',  stdReward: 1200,  netStd: -4800, netGem: -6000, netPct: '20%',     mythicPacks: 0, normalPacks: 6,  gems: 0,     usd: 0    },
  { format: 'Direct', cost: 6000, wins: '2-2', winrate: '50%',     stdReward: 1200,  netStd: -4800, netGem: -6000, netPct: '20%',     mythicPacks: 0, normalPacks: 6,  gems: 0,     usd: 0    },
  { format: 'Direct', cost: 6000, wins: '3-2', winrate: '60%',     stdReward: 5500,  netStd: -500,  netGem: -3300, netPct: '91.67%',  mythicPacks: 0, normalPacks: 14, gems: 2700,  usd: 13.5 },
  { format: 'Direct', cost: 6000, wins: '4-2', winrate: '66.67%',  stdReward: 9800,  netStd: 3800,  netGem: -600,  netPct: '163.33%', mythicPacks: 0, normalPacks: 22, gems: 5400,  usd: 27   },
  { format: 'Direct', cost: 6000, wins: '5-2', winrate: '71.43%',  stdReward: 14100, netStd: 8100,  netGem: 2100,  netPct: '235%',    mythicPacks: 0, normalPacks: 30, gems: 8100,  usd: 40.5 },
  { format: 'Direct', cost: 6000, wins: '6-2', winrate: '75%',     stdReward: 12500, netStd: 6500,  netGem: 6500,  netPct: '208.33%', mythicPacks: 0, normalPacks: 0,  gems: 12500, usd: 125  },
  { format: 'Direct', cost: 6000, wins: '7-0', winrate: '100%',    stdReward: 25000, netStd: 19000, netGem: 19000, netPct: '416.67%', mythicPacks: 0, normalPacks: 0,  gems: 25000, usd: 250  },
  { format: 'Direct', cost: 6000, wins: '7-1', winrate: '87.5%',   stdReward: 25000, netStd: 19000, netGem: 19000, netPct: '416.67%', mythicPacks: 0, normalPacks: 0,  gems: 25000, usd: 250  },

  // ── Pick Two Draft (900 gems) ──────────────────────────────────────────────
  { format: 'Pick2', cost: 900, wins: '0-2', winrate: '0%',      stdReward: 650,  netStd: -250, netGem: -850, netPct: '72.22%',  mythicPacks: 0, normalPacks: 1, gems: 50,   usd: 0.25 },
  { format: 'Pick2', cost: 900, wins: '1-2', winrate: '33.33%',  stdReward: 750,  netStd: -150, netGem: -750, netPct: '83.33%',  mythicPacks: 0, normalPacks: 1, gems: 150,  usd: 0.75 },
  { format: 'Pick2', cost: 900, wins: '2-2', winrate: '50%',     stdReward: 1400, netStd: 500,  netGem: -100, netPct: '155.56%', mythicPacks: 0, normalPacks: 1, gems: 800,  usd: 4    },
  { format: 'Pick2', cost: 900, wins: '3-2', winrate: '60%',     stdReward: 1800, netStd: 900,  netGem: 100,  netPct: '200%',    mythicPacks: 0, normalPacks: 2, gems: 1000, usd: 5    },
  { format: 'Pick2', cost: 900, wins: '4-0', winrate: '100%',    stdReward: 2300, netStd: 1400, netGem: 400,  netPct: '255.56%', mythicPacks: 0, normalPacks: 3, gems: 1300, usd: 6.5  },
  { format: 'Pick2', cost: 900, wins: '4-1', winrate: '80%',     stdReward: 2300, netStd: 1400, netGem: 400,  netPct: '255.56%', mythicPacks: 0, normalPacks: 3, gems: 1300, usd: 6.5  },

  // ── Premier Draft (1500 gems) ──────────────────────────────────────────────
  { format: 'Premier', cost: 1500, wins: '0-3', winrate: '0%',      stdReward: 650,  netStd: -850,  netGem: -1450, netPct: '43.33%',  mythicPacks: 0, normalPacks: 1, gems: 50,   usd: 0.25 },
  { format: 'Premier', cost: 1500, wins: '1-3', winrate: '25%',     stdReward: 700,  netStd: -800,  netGem: -1400, netPct: '46.67%',  mythicPacks: 0, normalPacks: 1, gems: 100,  usd: 0.5  },
  { format: 'Premier', cost: 1500, wins: '2-3', winrate: '40%',     stdReward: 1050, netStd: -450,  netGem: -1250, netPct: '70%',     mythicPacks: 0, normalPacks: 2, gems: 250,  usd: 1.25 },
  { format: 'Premier', cost: 1500, wins: '3-3', winrate: '50%',     stdReward: 1800, netStd: 300,   netGem: -500,  netPct: '120%',    mythicPacks: 0, normalPacks: 2, gems: 1000, usd: 5    },
  { format: 'Premier', cost: 1500, wins: '4-3', winrate: '57.14%',  stdReward: 2400, netStd: 900,   netGem: -100,  netPct: '160%',    mythicPacks: 0, normalPacks: 3, gems: 1400, usd: 7    },
  { format: 'Premier', cost: 1500, wins: '5-3', winrate: '62.5%',   stdReward: 2800, netStd: 1300,  netGem: 100,   netPct: '186.67%', mythicPacks: 0, normalPacks: 4, gems: 1600, usd: 8    },
  { format: 'Premier', cost: 1500, wins: '6-3', winrate: '66.67%',  stdReward: 3200, netStd: 1700,  netGem: 300,   netPct: '213.33%', mythicPacks: 0, normalPacks: 5, gems: 1800, usd: 9    },
  { format: 'Premier', cost: 1500, wins: '7-0', winrate: '100%',    stdReward: 3800, netStd: 2300,  netGem: 700,   netPct: '253.33%', mythicPacks: 0, normalPacks: 6, gems: 2200, usd: 11   },
  { format: 'Premier', cost: 1500, wins: '7-1', winrate: '87.5%',   stdReward: 3800, netStd: 2300,  netGem: 700,   netPct: '253.33%', mythicPacks: 0, normalPacks: 6, gems: 2200, usd: 11   },
  { format: 'Premier', cost: 1500, wins: '7-2', winrate: '77.78%',  stdReward: 3800, netStd: 2300,  netGem: 700,   netPct: '253.33%', mythicPacks: 0, normalPacks: 6, gems: 2200, usd: 11   },

  // ── Quick Draft (750 gems) ─────────────────────────────────────────────────
  { format: 'Quick', cost: 750, wins: '0-3', winrate: '0%',      stdReward: 550,  netStd: -200, netGem: -700, netPct: '73.33%',  mythicPacks: 0, normalPacks: 1, gems: 50,  usd: 0.25 },
  { format: 'Quick', cost: 750, wins: '1-3', winrate: '25%',     stdReward: 600,  netStd: -150, netGem: -650, netPct: '80%',     mythicPacks: 0, normalPacks: 1, gems: 100, usd: 0.5  },
  { format: 'Quick', cost: 750, wins: '2-3', winrate: '40%',     stdReward: 700,  netStd: -50,  netGem: -550, netPct: '93.33%',  mythicPacks: 0, normalPacks: 1, gems: 200, usd: 1    },
  { format: 'Quick', cost: 750, wins: '3-3', winrate: '50%',     stdReward: 800,  netStd: 50,   netGem: -450, netPct: '106.67%', mythicPacks: 0, normalPacks: 1, gems: 300, usd: 1.5  },
  { format: 'Quick', cost: 750, wins: '4-3', winrate: '57.14%',  stdReward: 950,  netStd: 200,  netGem: -300, netPct: '126.67%', mythicPacks: 0, normalPacks: 1, gems: 450, usd: 2.25 },
  { format: 'Quick', cost: 750, wins: '5-3', winrate: '62.5%',   stdReward: 1150, netStd: 400,  netGem: -100, netPct: '153.33%', mythicPacks: 0, normalPacks: 1, gems: 650, usd: 3.25 },
  { format: 'Quick', cost: 750, wins: '6-3', winrate: '66.67%',  stdReward: 1350, netStd: 600,  netGem: 100,  netPct: '180%',    mythicPacks: 0, normalPacks: 1, gems: 850, usd: 4.25 },
  { format: 'Quick', cost: 750, wins: '7-0', winrate: '100%',    stdReward: 1650, netStd: 900,  netGem: 200,  netPct: '220%',    mythicPacks: 0, normalPacks: 2, gems: 950, usd: 4.75 },
  { format: 'Quick', cost: 750, wins: '7-1', winrate: '87.5%',   stdReward: 1650, netStd: 900,  netGem: 200,  netPct: '220%',    mythicPacks: 0, normalPacks: 2, gems: 950, usd: 4.75 },
  { format: 'Quick', cost: 750, wins: '7-2', winrate: '77.78%',  stdReward: 1650, netStd: 900,  netGem: 200,  netPct: '220%',    mythicPacks: 0, normalPacks: 2, gems: 950, usd: 4.75 },

  // ── Traditional Draft (1500 gems) — 3 fixed rounds ────────────────────────
  { format: 'Traditional', cost: 1500, wins: '0-3', winrate: '0%',      stdReward: 700,  netStd: -800, netGem: -1400, netPct: '46.67%',  mythicPacks: 0, normalPacks: 1, gems: 100,  usd: 0.5  },
  { format: 'Traditional', cost: 1500, wins: '1-2', winrate: '33.33%',  stdReward: 850,  netStd: -650, netGem: -1250, netPct: '56.67%',  mythicPacks: 0, normalPacks: 1, gems: 250,  usd: 1.25 },
  { format: 'Traditional', cost: 1500, wins: '2-1', winrate: '66.67%',  stdReward: 2000, netStd: 500,  netGem: -500,  netPct: '133.33%', mythicPacks: 0, normalPacks: 3, gems: 1000, usd: 5    },
  { format: 'Traditional', cost: 1500, wins: '3-0', winrate: '100%',    stdReward: 4100, netStd: 2600, netGem: 1000,  netPct: '273.33%', mythicPacks: 0, normalPacks: 6, gems: 2500, usd: 12.5 },
];

// Quick-access lookup: REWARDS_LOOKUP['Premier']['7-2'] → { netGem, cost, ... }
export const REWARDS_LOOKUP: Partial<Record<RewardFormatKey, Record<string, RewardRow>>> = {};
for (const row of REWARDS_TABLE) {
  (REWARDS_LOOKUP[row.format] ??= {})[row.wins] = row;
}

// Maps app format names → rewards table key
export const FORMAT_TO_REWARD_KEY: Record<string, RewardFormatKey> = {
  'Premier Draft': 'Premier',
  'Traditional Draft': 'Traditional',
  'Quick Draft': 'Quick',
  'PickTwoDraft': 'Pick2',
  'Contender Draft': 'Contender',
  'Direct Draft': 'Direct',
};

export const REWARD_DISPLAY_NAME: Record<RewardFormatKey, string> = {
  Contender: 'Contender Draft',
  Direct: 'Direct Draft',
  Pick2: 'Pick Two Draft',
  Premier: 'Premier Draft',
  Quick: 'Quick Draft',
  Traditional: 'Traditional Draft',
};
