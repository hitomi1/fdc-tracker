import { useEffect, useRef } from 'react';
import type { DraftEvent } from '../types';
import { calcStats, fmtGem, formatDateShort, getNetGem } from '../lib/events';

export function PerformanceTab({ events }: { events: DraftEvent[] }) {
  const stats = calcStats(events);
  const wr = stats.winRate !== null ? stats.winRate.toFixed(1) + '%' : '—';
  const trophies = stats.trophies;

  const totalNetGem = events.reduce((sum, ev) => sum + (getNetGem(ev) ?? 0), 0);
  const knownCount = events.filter(ev => getNetGem(ev) !== null).length;
  const gemCls = totalNetGem >= 0 ? 'gem-positive' : 'gem-negative';

  return (
    <section id="performance-section" className="tab-content" aria-label="Performance statistics">
      <div id="overall-records" aria-label="Overall records">
        <p className="section-title">Overall Records</p>
        <div className="records-block">
          <div className="record-line">
            <span className="record-key">Games</span>
            <span className="record-val">{stats.totalWins} – {stats.totalLosses}</span>
            <span className="record-pct">({wr})</span>
          </div>
          <div className="record-line">
            <span className="record-key">Matches</span>
            <span className="record-val">{stats.totalWins} – {stats.totalLosses}</span>
            <span className="record-pct">({wr})</span>
          </div>
          <div className="record-line">
            <span className="record-key">Total Events</span>
            <span className="record-val">{stats.total}</span>
            <span className="record-pct">({trophies} {trophies === 1 ? 'Trophy' : 'Trophies'})</span>
          </div>
          <div className="record-line">
            <span className="record-key">💎 Net Gems</span>
            <span className={`record-val ${gemCls}`}>{fmtGem(totalNetGem)}</span>
            {knownCount < events.length && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ({knownCount}/{events.length} events)
              </span>
            )}
          </div>
        </div>
      </div>

      <div id="chart-section">
        <h3 className="chart-title">Event Win Rate History</h3>
        <WinRateChart events={events} />
      </div>
    </section>
  );
}

function WinRateChart({ events }: { events: DraftEvent[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => drawChart(canvas, events);
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [events]);

  return <canvas ref={canvasRef} id="winrate-chart" role="img" aria-label="Win rate history chart" />;
}

function drawChart(canvas: HTMLCanvasElement, events: DraftEvent[]) {
  // Sort events by date ascending for rolling calculations
  const sorted = [...events].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const W = canvas.parentElement?.clientWidth || 600;
  const H = window.innerWidth < 560 ? 200 : 300;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const PAD_LEFT = 48;
  const PAD_RIGHT = 16;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 36;
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOTTOM;

  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, W, H);

  if (sorted.length < 2) {
    ctx.fillStyle = '#4a5568';
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Not enough events to display chart.', W / 2, H / 2);
    return;
  }

  // Rolling win rates: last 10, last 50, and cumulative
  function winRateSlice(arr: DraftEvent[], end: number, count: number): number | null {
    const start = Math.max(0, end - count + 1);
    let w = 0, l = 0;
    for (let j = start; j <= end; j++) { w += arr[j].wins; l += arr[j].losses; }
    const total = w + l;
    return total > 0 ? (w / total) * 100 : null;
  }

  const pts10 = sorted.map((_, i) => winRateSlice(sorted, i, 10));
  const pts50 = sorted.map((_, i) => winRateSlice(sorted, i, 50));
  const ptsAll = sorted.map((_, i) => winRateSlice(sorted, i, i + 1));

  const allVals = [...pts10, ...pts50, ...ptsAll].filter((v): v is number => v !== null);
  const minVal = Math.max(0, Math.floor((Math.min(...allVals) - 10) / 10) * 10);
  const maxVal = Math.min(100, Math.ceil((Math.max(...allVals) + 10) / 10) * 10);

  const toY = (pct: number) => PAD_TOP + chartH - ((pct - minVal) / (maxVal - minVal)) * chartH;
  const toX = (i: number) => PAD_LEFT + (i / (sorted.length - 1)) * chartW;

  // Grid lines + Y labels
  ctx.strokeStyle = '#2a2d4a';
  ctx.lineWidth = 1;
  for (let y = minVal; y <= maxVal; y += 10) {
    const yPx = toY(y);
    ctx.beginPath();
    ctx.moveTo(PAD_LEFT, yPx);
    ctx.lineTo(PAD_LEFT + chartW, yPx);
    ctx.stroke();

    ctx.fillStyle = '#4a5568';
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(y + '%', PAD_LEFT - 6, yPx + 3);
  }

  // 50% reference line
  if (50 >= minVal && 50 <= maxVal) {
    const y50 = toY(50);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD_LEFT, y50);
    ctx.lineTo(PAD_LEFT + chartW, y50);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawLine(pts: (number | null)[], color: string, lineWidth: number) {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let started = false;
    pts.forEach((v, i) => {
      if (v === null) return;
      const x = toX(i);
      const y = toY(v);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else { ctx.lineTo(x, y); }
    });
    ctx.stroke();
  }

  drawLine(ptsAll, '#48bb78', 1.5); // green — all events
  drawLine(pts50, '#00d4aa', 2);    // teal  — last 50
  drawLine(pts10, '#718096', 1.5);  // gray  — last 10

  // X axis date labels (up to 6 evenly spaced)
  ctx.fillStyle = '#4a5568';
  ctx.font = '10px system-ui, sans-serif';
  ctx.textAlign = 'center';
  const labelCount = Math.min(sorted.length, 6);
  for (let k = 0; k < labelCount; k++) {
    const idx = Math.round((k / (labelCount - 1)) * (sorted.length - 1));
    ctx.fillText(formatDateShort(sorted[idx].date), toX(idx), H - PAD_BOTTOM + 14);
  }

  // Legend (bottom right)
  const legendItems = [
    { color: '#718096', label: 'Last 10' },
    { color: '#00d4aa', label: 'Last 50' },
    { color: '#48bb78', label: 'All Events' },
  ];
  let lx = W - PAD_RIGHT;
  const ly = H - PAD_BOTTOM + 24;
  ctx.font = '10px system-ui, sans-serif';
  ctx.textAlign = 'right';
  legendItems.slice().reverse().forEach(item => {
    ctx.fillStyle = '#8892a4';
    const tw = ctx.measureText(item.label).width;
    ctx.fillText(item.label, lx, ly);
    lx -= tw + 6;
    ctx.fillStyle = item.color;
    ctx.fillRect(lx - 16, ly - 8, 14, 3);
    lx -= 22;
  });
}
