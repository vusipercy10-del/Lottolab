'use client';
import StructuralFusion from '../components/structural-fusion';
import MasterSystem from '../components/master-system';
import AdvancedLab from '../components/advanced-lab';
import PdfReader from '../components/pdf-reader';

export default function Home(){return <main style={{minHeight:'100vh',background:'#07111d',color:'#eef6ff',padding:'20px 16px'}}><header style={{maxWidth:1200,margin:'0 auto 18px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}><div><div style={{fontSize:12,letterSpacing:2,color:'#74b9ff',fontWeight:800}}>LOTTOLAB</div><h1 style={{margin:'4px 0',fontSize:30}}>Master Lottery Research System</h1><p style={{margin:0,color:'#8fa6be'}}>Complete analysis framework, selectable prediction plugins, master reports, structural fusion, PDF extraction and results research.</p></div><nav style={{display:'flex',gap:8,flexWrap:'wrap'}}><a href="#master-system" style={navStyle}>Master System ↓</a><a href="#pdf" style={navStyle}>PDF Reader ↓</a><a href="#advanced" style={navStyle}>Advanced Lab ↓</a><a href="/research-lab" style={navStyle}>Strategy Lab ↗</a><a href="/wheel-system" style={navStyle}>Wheel Lab ↗</a></nav></header><MasterSystem/><StructuralFusion/><div id="pdf"><PdfReader/></div><div id="advanced"><AdvancedLab/></div></main>}
const navStyle={background:'#102a45',border:'1px solid #315579',borderRadius:9,padding:'10px 13px',color:'#fff',textDecoration:'none',fontWeight:700,fontSize:13} as const;
