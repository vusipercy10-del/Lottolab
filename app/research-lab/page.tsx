'use client';

import { useMemo, useState } from 'react';

type Draw = number[];
type Game = { id: string; name: string; max: number; pick: number };
type Score = { n: number; score: number; frequency: number; gap: number; pair: number; triplet: number; markov: number; zone: number; ending: number };

const GAMES: Game[] = [
  { id: '3/15', name: 'UK 49s 3/15', max: 15, pick: 3 },
  { id: '4/20', name: 'Gosloto 4/20', max: 20, pick: 4 },
  { id: '8/20', name: 'Rapido 8/20', max: 20, pick: 8 },
  { id: '12/24', name: '12/24', max: 24, pick: 12 },
  { id: '7/49', name: 'Gosloto 7/49', max: 49, pick: 7 },
  { id: '20/80', name: '20/80', max: 80, pick: 20 },
];

const DEMO = `3,5,14\n5,9,11\n7,11,14\n8,13,14\n4,10,13\n5,11,13\n4,9,10\n1,11,13\n3,6,10\n2,3,12\n1,7,13\n4,10,11\n1,9,10\n6,9,10\n8,12,13\n6,10,13`;

function parse(raw: string, game: Game): Draw[] {
  return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(line =>
    Array.from(new Set(line.replace(/<[^>]+>/g, ' ').split(/[\s,|;:]+/).map(Number).filter(Number.isInteger).filter(n => n >= 1 && n <= game.max))).sort((a,b)=>a-b)
  ).filter(d => d.length === game.pick);
}
function pairKey(a:number,b:number){return `${Math.min(a,b)}-${Math.max(a,b)}`;}
function tripKey(a:number,b:number,c:number){return [a,b,c].sort((x,y)=>x-y).join('-');}
function combinations(draw:Draw,size:2|3){const out:string[]=[];for(let i=0;i<draw.length;i++)for(let j=i+1;j<draw.length;j++){if(size===2)out.push(pairKey(draw[i],draw[j]));else for(let k=j+1;k<draw.length;k++)out.push(tripKey(draw[i],draw[j],draw[k]));}return out;}
function zone(n:number,max:number){return Math.min(Math.ceil(n/Math.max(1,Math.ceil(max/5))),5);}
function pct(n:number,d:number){return d?Math.round(n/d*100):0;}
function analyse(draws:Draw[],game:Game,weights:Record<string,number>):Score[]{
  const freq=Array(game.max+1).fill(0),last=Array(game.max+1).fill(-1),ending=Array(10).fill(0);
  const pairs=new Map<string,number>(),trips=new Map<string,number>(),transitions=new Map<string,number>();
  draws.forEach((d,idx)=>{d.forEach(n=>{freq[n]++;last[n]=idx;ending[n%10]++;});combinations(d,2).forEach(k=>pairs.set(k,(pairs.get(k)||0)+1));combinations(d,3).forEach(k=>trips.set(k,(trips.get(k)||0)+1));if(idx)for(const a of draws[idx-1])for(const b of d){const k=`${a}>${b}`;transitions.set(k,(transitions.get(k)||0)+1);}});
  const maxF=Math.max(1,...freq),maxE=Math.max(1,...ending),maxP=Math.max(1,...pairs.values(),0),maxT=Math.max(1,...trips.values(),0),maxTr=Math.max(1,...transitions.values(),0),latest=draws[draws.length-1]||[];
  return Array.from({length:game.max},(_,i)=>i+1).map(n=>{const pair=Math.max(0,...latest.filter(a=>a!==n).map(a=>pairs.get(pairKey(n,a))||0));const trip=Math.max(0,...latest.flatMap(a=>latest.filter(b=>b!==a&&b!==n).map(b=>trips.get(tripKey(n,a,b))||0)),0);const markov=Math.max(0,...latest.map(a=>transitions.get(`${a}>${n}`)||0));const gap=last[n]<0?draws.length:draws.length-1-last[n];const z=draws.flat().filter(x=>zone(x,game.max)===zone(n,game.max)).length;const score=(freq[n]/maxF)*weights.frequency+Math.min(1,gap/Math.max(1,draws.length/3))*weights.gap+(pair/maxP)*weights.pair+(trip/maxT)*weights.triplet+(markov/maxTr)*weights.markov+Math.min(1,z/Math.max(1,draws.length*game.pick/5))*weights.zone+(ending[n%10]/maxE)*weights.ending;return{n,score,frequency:freq[n],gap,pair,triplet:trip,markov,zone:zone(n,game.max),ending:n%10};}).sort((a,b)=>b.score-a.score);
}
function pickCandidate(scores:Score[],game:Game){return scores.slice(0,game.pick).map(x=>x.n).sort((a,b)=>a-b);}
function matches(a:Draw,b:Draw){const s=new Set(b);return a.filter(n=>s.has(n)).length;}

export default function ResearchLab(){
  const[gameId,setGameId]=useState('3/15');const game=GAMES.find(g=>g.id===gameId)!;const[raw,setRaw]=useState(DEMO);const[window,setWindow]=useState(12);
  const[frequency,setFrequency]=useState(25),[gap,setGap]=useState(10),[pair,setPair]=useState(15),[triplet,setTriplet]=useState(10),[markov,setMarkov]=useState(20),[zoneW,setZoneW]=useState(10),[ending,setEnding]=useState(10);
  const draws=useMemo(()=>parse(raw,game),[raw,game]);const weights={frequency,gap,pair,triplet,markov,zone:zoneW,ending};const scores=useMemo(()=>analyse(draws,game,weights),[draws,game,frequency,gap,pair,triplet,markov,zoneW,ending]);const candidate=pickCandidate(scores,game);
  const[saved,setSaved]=useState<Draw[]>([]);const[actual,setActual]=useState('');const[message,setMessage]=useState('');const[backtest,setBacktest]=useState<{avg:number;best:number;zero:number;tests:number}|null>(null);const[sim,setSim]=useState<{avg:number;p95:number}|null>(null);
  function runBacktest(){if(draws.length<Math.max(5,window+1)){setMessage(`Need at least ${window+1} valid draws for this walk-forward test.`);return;}let total=0,best=0,zero=0,tests=0;for(let i=window;i<draws.length;i++){const train=draws.slice(Math.max(0,i-window),i);const pred=pickCandidate(analyse(train,game,weights),game);const m=matches(pred,draws[i]);total+=m;best=Math.max(best,m);if(!m)zero++;tests++;}setBacktest({avg:Number((total/tests).toFixed(2)),best,zero,tests});setMessage(`Backtest complete: ${tests} historical predictions evaluated.`);}
  function runSimulation(){if(!candidate.length){setMessage('No candidate is available. Check the dataset first.');return;}const trials=2000;let total=0;const counts:number[]=[];for(let t=0;t<trials;t++){const set=new Set<number>();while(set.size<game.pick)set.add(1+Math.floor(Math.random()*game.max));const m=matches(candidate,[...set]);total+=m;counts.push(m);}counts.sort((a,b)=>a-b);setSim({avg:Number((total/trials).toFixed(3)),p95:counts[Math.floor(trials*.95)]});setMessage(`Monte Carlo complete: ${trials.toLocaleString()} random draws tested.`);}
  function savePrediction(){if(!candidate.length){setMessage('No prediction available to save.');return;}setSaved(v=>[...v,candidate]);setMessage(`Prediction saved: ${candidate.join(' · ')}`);}
  function evaluateSaved(){const a=parse(actual,game)[0];if(!a){setMessage(`Enter exactly ${game.pick} valid numbers from 1–${game.max}.`);return;}if(!saved.length){setMessage('Save a prediction before evaluating it.');return;}setMessage(`Latest saved prediction matched ${matches(saved[saved.length-1],a)}/${game.pick}.`);}
  const validRows=raw.split(/\r?\n/).filter(x=>x.trim()).length;
  return <main style={{minHeight:'100vh',padding:24,fontFamily:'system-ui',background:'#0b1020',color:'#eef2ff'}}><div style={{maxWidth:1250,margin:'0 auto'}}>
    <header style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',marginBottom:24,flexWrap:'wrap'}}><div><div style={{fontSize:13,letterSpacing:2,opacity:.7}}>LOTTOLAB • V13 RESEARCH ENGINE</div><h1 style={{fontSize:34,margin:'6px 0'}}>Strategy Lab + Backtesting</h1><div style={{opacity:.75}}>Data validation, ensemble scoring, walk-forward testing, prediction tracking and Monte Carlo baseline.</div></div><a href="/" style={{color:'#fff',textDecoration:'none',border:'1px solid #3b4565',padding:'10px 14px',borderRadius:10}}>← Dashboard</a></header>
    {message&&<div role="status" style={{...pill,display:'block',marginBottom:16}}>{message}</div>}
    <section style={card}><h2 style={h2}>1. Data Engine</h2><div style={grid2}><label>Game<select value={gameId} onChange={e=>setGameId(e.target.value)} style={input}>{GAMES.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label><label>Walk-forward window<input type="number" min={3} value={window} onChange={e=>setWindow(Math.max(3,+e.target.value||3))} style={input}/></label></div><textarea value={raw} onChange={e=>setRaw(e.target.value)} style={{...input,width:'100%',minHeight:160,marginTop:12}} placeholder="Paste one draw per line. Numbers may be separated by commas, spaces, | or ;."/><div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}><span style={pill}>Rows supplied: {validRows}</span><span style={pill}>Valid draws: {draws.length}</span><span style={pill}>Required: {game.pick} numbers</span><span style={pill}>Range: 1–{game.max}</span><span style={{...pill,background:draws.length===validRows?'#123d2b':'#4a2d12'}}>{draws.length===validRows?'DATA CLEAN':'CHECK INVALID ROWS'}</span></div></section>
    <section style={card}><h2 style={h2}>2. Strategy Lab — model weights</h2><div style={sliderGrid}>{[['Frequency',frequency,setFrequency],['Gap/Skip',gap,setGap],['Pair',pair,setPair],['Triplet',triplet,setTriplet],['Markov',markov,setMarkov],['Zone',zoneW,setZoneW],['Last digit',ending,setEnding]].map(([name,val,setter]:any)=><label key={name}>{name}<strong>{val}%</strong><input type="range" min="0" max="40" value={val} onChange={e=>setter(+e.target.value)}/></label>)}</div><p style={{opacity:.65,fontSize:13}}>Weights are research controls. Backtesting determines whether a configuration is historically stable; it does not establish future winning probability.</p></section>
    <section style={card}><h2 style={h2}>3. Ensemble Prediction</h2><div style={candidateBox}>{candidate.map(n=><span key={n} style={ball}>{n}</span>)}</div><div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:14}}><button onClick={savePrediction} style={button}>Save prediction</button><button onClick={runBacktest} style={button}>Run walk-forward backtest</button><button onClick={runSimulation} style={button}>Run 2,000 Monte Carlo trials</button></div><div style={{overflowX:'auto',marginTop:18}}><table style={table}><thead><tr><th>Rank</th><th>Number</th><th>Score</th><th>Freq</th><th>Gap</th><th>Pair</th><th>Triplet</th><th>Markov</th><th>Zone</th><th>Ending</th></tr></thead><tbody>{scores.slice(0,Math.min(20,game.max)).map((s,i)=><tr key={s.n}><td>{i+1}</td><td><strong>{s.n}</strong></td><td>{s.score.toFixed(1)}</td><td>{s.frequency}</td><td>{s.gap}</td><td>{s.pair}</td><td>{s.triplet}</td><td>{s.markov}</td><td>{s.zone}</td><td>{s.ending}</td></tr>)}</tbody></table></div></section>
    <section style={card}><h2 style={h2}>4. Backtesting + Baseline</h2>{backtest?<div style={metricGrid}><Metric label="Tests" value={backtest.tests}/><Metric label="Average matches" value={`${backtest.avg}/${game.pick}`}/><Metric label="Best result" value={`${backtest.best}/${game.pick}`}/><Metric label="Zero-match rate" value={`${pct(backtest.zero,backtest.tests)}%`}/></div>:<p style={{opacity:.7}}>Run the walk-forward test. Each target draw is hidden; the model only sees earlier draws, preventing future-data leakage.</p>}{sim&&<div style={{marginTop:14}}><span style={pill}>Random baseline average: {sim.avg} matches</span><span style={{...pill,marginLeft:8}}>95th percentile: {sim.p95} matches</span></div>}</section>
    <section style={card}><h2 style={h2}>5. Prediction Tracker</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input value={actual} onChange={e=>setActual(e.target.value)} placeholder="Paste actual next draw" style={{...input,flex:1,minWidth:240}}/><button onClick={evaluateSaved} style={button}>Evaluate latest saved prediction</button></div><div style={{marginTop:12}}>{saved.map((p,i)=><div key={i} style={{padding:'9px 0',borderBottom:'1px solid #252d45'}}>#{i+1}: {p.join(' · ')}</div>)}</div></section>
    <section style={card}><h2 style={h2}>6. Engine Status</h2><div style={grid2}>{['Data validation','Frequency/recency','Markov transitions','Zone analysis','Pair/triplet analysis','Ensemble scoring','Walk-forward backtest','Monte Carlo baseline','Prediction tracker'].map(x=><div key={x} style={{...pill,display:'flex',justifyContent:'space-between'}}><span>{x}</span><span>✓</span></div>)}</div></section><footer style={{opacity:.55,fontSize:12,marginTop:18}}>LottoLab is a research and statistical analysis tool. Lottery outcomes remain random; historical patterns and model scores cannot guarantee future results.</footer>
  </div></main>;
}
function Metric({label,value}:{label:string;value:string|number}){return <div style={{...pill,minHeight:72}}><div style={{opacity:.65,fontSize:12}}>{label}</div><strong style={{fontSize:24}}>{value}</strong></div>}
const card={background:'#11182b',border:'1px solid #27304a',borderRadius:16,padding:20,marginBottom:16,boxShadow:'0 8px 30px rgba(0,0,0,.18)'} as const;
const h2={fontSize:19,margin:'0 0 14px'} as const;
const input={background:'#0b1020',color:'#eef2ff',border:'1px solid #36415f',borderRadius:10,padding:'10px 12px',fontSize:14} as const;
const button={background:'#243b68',color:'#fff',border:'1px solid #4668a6',borderRadius:10,padding:'10px 14px',cursor:'pointer'} as const;
const pill={background:'#1a2338',border:'1px solid #303b59',borderRadius:10,padding:'9px 12px',display:'inline-block'} as const;
const grid2={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12} as const;
const sliderGrid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16} as const;
const metricGrid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12} as const;
const candidateBox={display:'flex',gap:10,flexWrap:'wrap'} as const;
const ball={width:46,height:46,borderRadius:'50%',display:'grid',placeItems:'center',background:'#244b8a',border:'2px solid #638bd0',fontWeight:800} as const;
const table={width:'100%',borderCollapse:'collapse',fontSize:13} as const;
