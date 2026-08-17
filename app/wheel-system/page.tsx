'use client';

import { useMemo, useState } from 'react';

const MAX = 49;

function tinoWheel(anchor: number) {
  const out: number[] = [];
  for (let n = anchor; n <= MAX; n += 12) out.push(n);
  return out;
}

function boomChain(start: number) {
  const out: number[] = [];
  for (let n = start; n <= MAX; n += 15) out.push(n);
  return out;
}

function section9(section: number) {
  return Array.from({ length: MAX }, (_, i) => i + 1).filter(n => ((n - 1) % 9) + 1 === section);
}

function step9Groups() {
  return Array.from({ length: 13 }, (_, i) => i + 1).map(start => {
    const nums: number[] = [];
    for (let n = start; n <= MAX; n += 9) nums.push(n);
    return { start, nums };
  });
}

function partnersFromText(raw: string) {
  const rows: { base: number; partners: number[] }[] = [];
  raw.split(/\n|;/).forEach(line => {
    const nums = line.match(/\d+/g)?.map(Number) ?? [];
    if (nums.length >= 2 && nums[0] >= 1 && nums[0] <= MAX) {
      rows.push({ base: nums[0], partners: Array.from(new Set(nums.slice(1).filter(n => n >= 1 && n <= MAX))) });
    }
  });
  return rows;
}

const defaultPartners = `1: 18 6 39 35 17 13\n2: 16 11 1 15 6 17\n3: 48 29 15 4 38 22\n4: 12 26 39 16 15 49\n5: 7 20 31 27 5 24\n6: 41 1 11 16 33 9\n7: 36 14 24 21 28 46\n8: 31 9 23 21 17 24\n9: 12 13 35 42 18 22\n10: 9 39 45 33 16 20\n11: 22 27 15 12 6 8\n12: 31 14 19 26 9 4\n13: 2 21 28 5 14 9\n14: 28 21 27 46 7 31\n15: 18 29 26 21 6 31\n16: 25 29 31 16 6 4\n17: 1 23 8 21 35 46\n18: 48 45 29 15 32 42\n19: 33 4 1 21 7 6\n20: 24 44 5 25 27 2\n21: 14 33 8 21 27 4\n22: 3 11 27 49 9 46\n23: 17 8 48 27 21 22\n24: 7 20 27 24 35 30\n25: 16 26 27 30 20 17\n26: 29 27 4 15 38 22\n27: 28 7 7 27 46 22\n28: 7 13 18 9 29 14\n29: 15 21 3 26 4 39\n30: 35 30 4 25 33 31\n31: 8 13 15 17 35 12\n32: 18 33 27 28 16 7\n33: 19 34 21 15 45 10\n34: 8 17 37 44 18 26\n35: 1 9 15 17 31 4\n36: 14 7 18 21 39 1\n37: 31 38 47 15 18 7\n38: 45 26 38 1 17 15\n39: 40 45 1 4 26 21\n40: 14 45 3 45 29 38\n41: 14 6 7 1 27 10\n42: 44 45 47 46 24 18\n43: 44 41 37 17 8 31\n44: 45 42 38 29 18 47\n45: 39 18 19 47 29 23\n46: 27 3 38 40 22 20\n47: 45 42 48 18 27\n48: 23 27 4 45 26\n49: 9 27 26 15 29`;

export default function WheelSystemPage() {
  const [selected, setSelected] = useState(17);
  const [section, setSection] = useState(8);
  const [partnerText, setPartnerText] = useState(defaultPartners);
  const [copied, setCopied] = useState('');

  const wheel = useMemo(() => tinoWheel(((selected - 1) % 12) + 1), [selected]);
  const booms = useMemo(() => boomChain(((selected - 1) % 15) + 1), [selected]);
  const sec = useMemo(() => section9(section), [section]);
  const partners = useMemo(() => partnersFromText(partnerText), [partnerText]);
  const selectedPartners = partners.find(x => x.base === selected)?.partners ?? [];
  const stepGroups = useMemo(() => step9Groups(), []);

  const copy = (label: string, values: number[]) => {
    navigator.clipboard?.writeText(values.join(', '));
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1400);
  };

  return (
    <main className="wrap">
      <div className="topbar">
        <div><div className="eyebrow">LOTTOLAB • 49 NUMBER RESEARCH</div><h1>Tino Wheel + Sections + Daily Booms Lab</h1><p>Interactive implementation of the number structures shown in the supplied reference images. These are deterministic mathematical groupings for research, filtering and wheel construction—not winning guarantees.</p></div>
        <a className="back" href="/">← Back to LottoLab</a>
      </div>

      <section className="controls panel">
        <label>Selected number<select value={selected} onChange={e => setSelected(Number(e.target.value))}>{Array.from({length:49},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label>
        <label>9-section<select value={section} onChange={e => setSection(Number(e.target.value))}>{Array.from({length:9},(_,i)=><option key={i+1} value={i+1}>Section {i+1}</option>)}</select></label>
        <button onClick={() => copy('Tino Wheel', wheel)}>Copy wheel</button>
        <button onClick={() => copy('Daily Booms', booms)}>Copy booms</button>
        <button onClick={() => copy('Section', sec)}>Copy section</button>
        {copied && <span className="copied">✓ {copied} copied</span>}
      </section>

      <section className="grid2">
        <article className="panel">
          <div className="head"><h2>Tino's Wheel of Fortune</h2><span>+12 movement</span></div>
          <div className="wheelBox">
            <div className="wheelCircle">
              {Array.from({length:12},(_,i)=>{
                const a=i+1; const angle=(i*30)-90; const x=50+42*Math.cos(angle*Math.PI/180); const y=50+42*Math.sin(angle*Math.PI/180);
                return <button key={a} className={a===((selected-1)%12)+1?'node active':'node'} style={{left:`${x}%`,top:`${y}%`}} onClick={()=>setSelected(a)}>{a}</button>
              })}
              <div className="center">TINOLAB<br/><small>WHEEL</small></div>
            </div>
          </div>
          <div className="resultLine"><b>Wheel group for {selected}</b><div className="nums">{wheel.map(n=><button className={n===selected?'num selected':'num'} key={n} onClick={()=>setSelected(n)}>{n}</button>)}</div></div>
          <p className="note">Formula: anchor + 12k, keeping values ≤49. The reference image places 1–12 around the wheel and extends each spoke by 12.</p>
        </article>

        <article className="panel">
          <div className="head"><h2>Valentino's Daily Booms</h2><span>+15 movement</span></div>
          <div className="chain">{booms.map((n,i)=><div key={n} className={n===selected?'chainItem active':'chainItem'}><span>{i+1}</span><b>{n}</b></div>)}</div>
          <div className="matrix">{Array.from({length:15},(_,i)=>{const row=boomChain(i+1);return <div className={row.includes(selected)?'row selectedRow':'row'} key={i+1}><b>{String(i+1).padStart(2,'0')}</b>{row.map(n=><button key={n} onClick={()=>setSelected(n)}>{n}</button>)}</div>})}</div>
          <p className="note">Formula: start, start+15, start+30, start+45. The reference photo appears to contain a typo around 29/43; LottoLab uses the consistent +15 arithmetic rule, giving 14–29–44.</p>
        </article>
      </section>

      <section className="panel">
        <div className="head"><h2>1–49 Sections (mod 9)</h2><span>Section {section} selected</span></div>
        <div className="sectionGrid">{Array.from({length:9},(_,i)=>{const s=i+1;return <button className={s===section?'sectionCard active':'sectionCard'} key={s} onClick={()=>setSection(s)}><strong>{s}</strong><span>{section9(s).join(' · ')}</span></button>})}</div>
        <div className="selectedBox"><b>Section {section}</b><div className="nums">{sec.map(n=><button className={n===selected?'num selected':'num'} key={n} onClick={()=>setSelected(n)}>{n}</button>)}</div></div>
        <p className="note">This is the 9-column pattern in the supplied image: each row advances by 9, so numbers share the same position modulo 9.</p>
      </section>

      <section className="panel">
        <div className="head"><h2>9-Step Triangle / Staircase Grid</h2><span>+9 movement</span></div>
        <div className="triangle">{stepGroups.map(g=><div className={g.nums.includes(selected)?'triRow active':'triRow'} key={g.start}><b>{g.start}</b>{g.nums.map(n=><button key={n} onClick={()=>setSelected(n)}>{n}</button>)}</div>)}</div>
        <p className="note">This reproduces the second 1–49 layout in the supplied screenshot: rows are generated by repeatedly adding 9 and stopping at 49.</p>
      </section>

      <section className="grid2">
        <article className="panel">
          <div className="head"><h2>Selected-number consensus</h2><span>{selected}</span></div>
          <div className="consensus">
            <div><b>Tino wheel</b><span>{wheel.join(' · ')}</span></div>
            <div><b>Daily Booms</b><span>{booms.join(' · ')}</span></div>
            <div><b>Section 9</b><span>{sec.join(' · ')}</span></div>
            <div><b>Partner list</b><span>{selectedPartners.length ? selectedPartners.join(' · ') : 'No imported partners for this number'}</span></div>
          </div>
          <div className="formula">Wheel overlap = numbers appearing in multiple structures. Use this as a filter/coverage signal only.</div>
        </article>

        <article className="panel">
          <div className="head"><h2>Dreams & Numbers Partner Matrix</h2><span>editable source table</span></div>
          <p className="note">The partner image is treated as a reference table. You can edit or paste a corrected matrix below; LottoLab will parse one row per line as <code>base: partner partner partner...</code>.</p>
          <textarea value={partnerText} onChange={e=>setPartnerText(e.target.value)} />
          <div className="partnerPreview">{partners.slice(0,12).map(r=><button key={r.base} className={r.base===selected?'pRow active':'pRow'} onClick={()=>setSelected(r.base)}><b>{r.base}</b><span>{r.partners.join(', ')}</span></button>)}</div>
        </article>
      </section>

      <section className="panel">
        <div className="head"><h2>LottoLab integration rules</h2><span>ready for Master Engine</span></div>
        <div className="rules">
          <div><b>01 • Wheel</b><span>Generate +12 spoke groups for 1–49.</span></div>
          <div><b>02 • Booms</b><span>Generate +15 chains and detect chain membership.</span></div>
          <div><b>03 • Sections</b><span>Generate 9 modulo sections and selected-section filters.</span></div>
          <div><b>04 • Triangle</b><span>Generate +9 staircase groups for visual/structural coverage.</span></div>
          <div><b>05 • Partners</b><span>Import/edit external partner mappings without hard-coding them into the statistical model.</span></div>
          <div><b>06 • Consensus</b><span>Score a number higher when multiple independent structures support it, then validate the rule by walk-forward backtesting.</span></div>
        </div>
      </section>

      <footer>© LottoLab • Structural lottery research only • No method can guarantee a future lottery result.</footer>

      <style jsx>{`
        *{box-sizing:border-box}.wrap{min-height:100vh;padding:28px;background:#07111f;color:#e7eef8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.topbar{max-width:1200px;margin:0 auto 18px;display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.eyebrow{font-size:11px;letter-spacing:.16em;color:#79b8ff;font-weight:800}.topbar h1{font-size:clamp(25px,4vw,42px);margin:7px 0}.topbar p{max-width:850px;color:#9fb0c6;line-height:1.55}.back{border:1px solid #29415d;border-radius:12px;padding:10px 14px;color:#dbeafe;text-decoration:none;white-space:nowrap}.panel{max-width:1200px;margin:0 auto 18px;background:#0d1a2b;border:1px solid #213852;border-radius:18px;padding:18px;box-shadow:0 12px 35px rgba(0,0,0,.18)}.grid2{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:18px}.controls{display:flex;gap:12px;align-items:end;flex-wrap:wrap}.controls label{display:grid;gap:6px;color:#9fb0c6;font-size:12px;font-weight:700}.controls select,.controls button{height:40px;border-radius:10px;border:1px solid #2b4764;background:#101f33;color:#e7eef8;padding:0 12px}.controls button{cursor:pointer;font-weight:800}.copied{color:#77e0ae;font-weight:800;font-size:12px}.head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.head h2{font-size:18px;margin:0}.head span{font-size:11px;color:#7fa1c5;border:1px solid #29415d;padding:6px 9px;border-radius:999px}.wheelBox{height:340px;display:grid;place-items:center}.wheelCircle{position:relative;width:min(300px,80vw);aspect-ratio:1;border-radius:50%;border:2px solid #2e5c87;background:radial-gradient(circle,#102945 0 30%,#0b1c30 31% 70%,#0a1626 71%);box-shadow:inset 0 0 50px rgba(66,153,225,.12)}.center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:100px;height:100px;border-radius:50%;display:grid;place-items:center;text-align:center;background:#12304e;border:1px solid #3974a9;font-size:13px;font-weight:900}.center small{font-size:9px;color:#91bde7}.node{position:absolute;transform:translate(-50%,-50%);width:34px;height:34px;border-radius:50%;border:1px solid #365a7d;background:#102238;color:#dbeafe;font-weight:900;cursor:pointer}.node.active{background:#2f8cff;color:#fff;border-color:#7dc0ff;box-shadow:0 0 18px rgba(47,140,255,.5)}.resultLine,.selectedBox{border-top:1px solid #213852;padding-top:14px}.resultLine b,.selectedBox b{display:block;margin-bottom:8px}.nums{display:flex;gap:7px;flex-wrap:wrap}.num{border:1px solid #2c4762;background:#11243a;color:#e7eef8;border-radius:9px;padding:7px 10px;font-weight:900;cursor:pointer}.num.selected{background:#2f8cff;border-color:#7dc0ff}.note{color:#8ea4bd;font-size:12px;line-height:1.55}.chain{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.chainItem{display:grid;gap:2px;place-items:center;min-width:54px;padding:9px;border-radius:12px;background:#102238;border:1px solid #29415d}.chainItem span{font-size:9px;color:#7692ad}.chainItem.active{border-color:#5ba7ff;background:#12385e}.matrix{display:grid;gap:4px}.row{display:flex;align-items:center;gap:4px;padding:3px 5px;border-radius:8px}.row b{width:26px;color:#7892ac;font-size:11px}.row button,.triRow button{min-width:34px;border:0;background:#152940;color:#d8e7f7;border-radius:7px;padding:6px 7px;font-weight:800;cursor:pointer}.row button:hover,.triRow button:hover{background:#244566}.selectedRow{background:#102c47;outline:1px solid #2e5c87}.sectionGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.sectionCard{display:grid;gap:7px;text-align:left;border:1px solid #29415d;background:#102238;color:#dcecff;border-radius:12px;padding:12px;cursor:pointer}.sectionCard strong{font-size:20px}.sectionCard span{font-size:12px;color:#8fa7bf;line-height:1.5}.sectionCard.active{border-color:#4ea1ff;background:#123454}.triangle{display:grid;gap:5px;max-width:760px;margin:auto}.triRow{display:flex;gap:5px;align-items:center;padding:4px;border-radius:8px}.triRow b{width:28px;color:#7892ac;font-size:11px}.triRow.active{background:#102c47}.consensus{display:grid;gap:10px}.consensus div{display:grid;gap:4px;border:1px solid #223b56;background:#0a1727;padding:11px;border-radius:11px}.consensus b{font-size:12px}.consensus span{font-size:13px;color:#b6c8dc}.formula{margin-top:12px;padding:11px;border-radius:10px;background:#10253b;color:#8ea4bd;font-size:12px}.panel textarea{width:100%;min-height:210px;background:#091523;color:#dbeafe;border:1px solid #29415d;border-radius:11px;padding:11px;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;resize:vertical}.partnerPreview{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-top:10px}.pRow{display:grid;grid-template-columns:30px 1fr;gap:7px;text-align:left;border:1px solid #223b56;background:#0b1828;color:#cfe0f2;border-radius:8px;padding:7px;cursor:pointer;font-size:11px}.pRow span{color:#8098b1}.pRow.active{border-color:#4ea1ff;background:#123454}.rules{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.rules div{display:grid;gap:4px;border:1px solid #223b56;background:#0a1727;padding:12px;border-radius:11px}.rules b{font-size:12px}.rules span{font-size:12px;color:#8fa7bf;line-height:1.45}code{background:#14273c;padding:2px 5px;border-radius:5px}footer{max-width:1200px;margin:24px auto;color:#6f849b;font-size:11px;text-align:center}@media(max-width:850px){.grid2{grid-template-columns:1fr}.topbar{display:block}.back{display:inline-block;margin-top:8px}.rules{grid-template-columns:1fr 1fr}}@media(max-width:520px){.wrap{padding:13px}.sectionGrid{grid-template-columns:1fr 1fr}.partnerPreview{grid-template-columns:1fr}.rules{grid-template-columns:1fr}.wheelBox{height:290px}}
      `}</style>
    </main>
  );
}
