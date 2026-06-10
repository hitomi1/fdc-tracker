import { fmtGem } from '../lib/events';
import {
  REWARDS_TABLE,
  REWARD_DISPLAY_NAME,
  type RewardFormatKey,
  type RewardRow,
} from '../data/rewards';

const STD_TOOLTIP =
  'Standardized Reward: soma de todas as recompensas (gems + pacotes) convertidas para gems usando taxas de mercado estimadas. Permite comparar o retorno real entre formatos.';

// Group rows by format preserving source order
const GROUPS: { key: RewardFormatKey; cost: number; rows: RewardRow[] }[] = [];
for (const row of REWARDS_TABLE) {
  let group = GROUPS.find(g => g.key === row.format);
  if (!group) {
    group = { key: row.format, cost: row.cost, rows: [] };
    GROUPS.push(group);
  }
  group.rows.push(row);
}

export function RewardsTab() {
  return (
    <section id="rewards-section" className="tab-content" aria-label="Rewards reference">
      <div id="rewards-content">
        <p className="section-title">Rewards Reference</p>
        <div className="rewards-legend">
          <p>
            <strong>Std Reward</strong>{' '}
            <span className="rewards-info-icon" title={STD_TOOLTIP}>ⓘ</span>{' '}
            — valor total do prêmio em gems (pacotes convertidos pela taxa de mercado estimada).
          </p>
          <p><strong>Net Std</strong> — Std Reward menos o custo de entrada.</p>
          <p><strong>Net Gem</strong> — apenas gems diretas recebidas menos o custo. Valor usado no Event History.</p>
          <p><strong>Net%</strong> — Std Reward ÷ custo (quanto do entry você recupera).</p>
        </div>

        {GROUPS.map(({ key, cost, rows }) => (
          <div className="rewards-group" key={key}>
            <div className="rewards-group-header">
              <span className="rewards-format-name">{REWARD_DISPLAY_NAME[key]}</span>
              <span className="rewards-cost">Entry: {cost.toLocaleString()} 💎</span>
            </div>
            <div className="rewards-table-scroll">
              <table className="rewards-table">
                <thead>
                  <tr>
                    <th>Wins</th>
                    <th>Win%</th>
                    <th title={STD_TOOLTIP}>Std Reward ⓘ</th>
                    <th>Net Std</th>
                    <th className="col-net-gem">Net Gem</th>
                    <th>Net%</th>
                    <th>Mythic Packs</th>
                    <th>Normal Packs</th>
                    <th>Gems</th>
                    <th>USD</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.wins}>
                      <td className="record-cell">{row.wins}</td>
                      <td className="rewards-pct">{row.winrate}</td>
                      <td>{row.stdReward.toLocaleString()}</td>
                      <td className={row.netStd >= 0 ? 'gem-positive' : 'gem-negative'}>{fmtGem(row.netStd)}</td>
                      <td className={`gem-cell col-net-gem ${row.netGem >= 0 ? 'gem-positive' : 'gem-negative'}`}>
                        {fmtGem(row.netGem)}
                      </td>
                      <td className={parseFloat(row.netPct) >= 100 ? 'gem-positive' : 'gem-negative'}>{row.netPct}</td>
                      <td className="rewards-packs">{row.mythicPacks || '—'}</td>
                      <td className="rewards-packs">{row.normalPacks || '—'}</td>
                      <td>{row.gems ? row.gems.toLocaleString() : '—'}</td>
                      <td className="rewards-usd">{row.usd ? '$' + row.usd : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
