'use client';

import { useState } from 'react';

export default function PdfReader() {
  const [status, setStatus] = useState('No PDF loaded');
  const [text, setText] = useState('');
  const [rows, setRows] = useState<string[]>([]);

  async function readPdf(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setStatus('Please choose a PDF file.');
      return;
    }
    try {
      setStatus('Reading PDF…');
      setText('');
      setRows([]);
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const worker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
      // pdfjs v5 exposes the worker module through the module workerPort API.
      (pdfjs.GlobalWorkerOptions as { workerPort?: unknown }).workerPort = new worker.WorkerMessageHandler ? undefined : undefined;
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer), disableWorker: true });
      const pdf = await loadingTask.promise;
      const pages: string[] = [];
      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
      }
      const extracted = pages.join('\n\n').replace(/\s+/g, ' ').trim();
      const detected = extracted.match(/(?:\d{1,3}[\s,;|]+){2,}\d{1,3}/g) || [];
      setText(extracted);
      setRows(detected.slice(0, 500));
      setStatus(`Read ${pdf.numPages} page${pdf.numPages === 1 ? '' : 's'} • ${extracted.length.toLocaleString()} characters • ${detected.length} possible result rows`);
    } catch (error) {
      setStatus(`PDF read failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  return (
    <section style={{ background:'#0d1727', border:'1px solid #29415f', borderRadius:16, padding:20, margin:'20px auto', maxWidth:1200, color:'#e8f0f8' }}>
      <h2 style={{ marginTop:0 }}>PDF Results Reader</h2>
      <p style={{ color:'#91a5ba' }}>Extract selectable text from lottery-result PDFs locally in your browser. No OpenAI key is required and the PDF is not uploaded.</p>
      <input type="file" accept="application/pdf,.pdf" onChange={(e) => { const f=e.target.files?.[0]; if(f) void readPdf(f); }} />
      <div style={{ marginTop:12, padding:10, background:'#091321', borderRadius:10 }}>{status}</div>
      {rows.length > 0 && <div style={{ marginTop:14 }}><b>Possible result rows</b><pre style={{ whiteSpace:'pre-wrap', maxHeight:220, overflow:'auto', background:'#091321', padding:12, borderRadius:10 }}>{rows.join('\n')}</pre></div>}
      <details style={{ marginTop:14 }}><summary>Extracted text</summary><textarea readOnly value={text} style={{ width:'100%', minHeight:220, marginTop:10, background:'#091321', color:'#e8f0f8', border:'1px solid #29415f', borderRadius:10, padding:10 }} /></details>
    </section>
  );
}
