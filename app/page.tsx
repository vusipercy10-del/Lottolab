'use client';

import Dashboard from '../page';
import StructuralFusion from '../components/structural-fusion';

export default function Home() {
  return (
    <>
      <a href="/research-lab" style={{position:'fixed',right:18,top:18,zIndex:9999,background:'#243b68',color:'#fff',padding:'10px 14px',borderRadius:10,border:'1px solid #4668a6',textDecoration:'none',fontWeight:700,fontSize:13}}>Strategy Lab ↗</a>
      <Dashboard />
      <StructuralFusion />
    </>
  );
}
