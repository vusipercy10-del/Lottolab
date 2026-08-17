import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"');
}

function cleanHtml(html: string) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const url = typeof body?.url === 'string' ? body.url.trim() : '';

    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ ok: false, error: 'Enter a valid http(s) results URL.' }, { status: 400 });
    }

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; LottoLabResultsFetcher/1.0)',
      },
      signal: AbortSignal.timeout(20000),
    });

    const contentType = response.headers.get('content-type') || '';
    const bodyText = await response.text();

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        error: `Source returned HTTP ${response.status}. The site may block automated requests.`,
        status: response.status,
      }, { status: 502 });
    }

    const text = contentType.includes('html') ? cleanHtml(bodyText) : bodyText.slice(0, 1000000);
    const numberTokens = text.match(/\b\d{1,3}\b/g)?.map(Number) || [];

    return NextResponse.json({
      ok: true,
      url,
      finalUrl: response.url,
      contentType,
      characters: text.length,
      numbersFound: numberTokens.length,
      text: text.slice(0, 1000000),
      message: numberTokens.length ? 'Source fetched. Review the extracted text before importing results.' : 'Source fetched, but no numeric tokens were detected. The page may be JavaScript-rendered or protected.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch source.';
    return NextResponse.json({
      ok: false,
      error: message.includes('timeout') ? 'Source request timed out after 20 seconds.' : message,
    }, { status: 500 });
  }
}
