import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Please provide a valid http(s) URL.' }, { status: 400 });
    }
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LottoLab-Master-System/4.0 research client' },
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!res.ok) return NextResponse.json({ error: `Source returned HTTP ${res.status}.` }, { status: 502 });
    const html = await res.text();
    const rows: string[] = [];
    const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    for (const tr of trMatches) {
      const cells = tr.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi) || [];
      const text = cells.map(c => c.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim()).join(' ');
      if (text) rows.push(text);
    }
    const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&');
    const text = [...rows, stripped].join('\n');
    return NextResponse.json({ text: text.slice(0, 1000000), title: url });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unable to fetch source.' }, { status: 500 });
  }
}
