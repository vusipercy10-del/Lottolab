# LottoLab Master System v4

A Next.js 15 research dashboard for 3/15, 4/20, 7/49 and 20/80. It is designed around the user's Master System workflow:

Results → Frequency → Mathematical Types → Multiples → Multiple Overlap → Last Digits → Balance → Zones → Pairs/Triplets → Transitions → Pools → Master Score → Tickets → Backtest

## v4 additions

- 10 / 12 / 20 / 50 / 100 draw windows
- Long-term vs recent comparison
- Best-effort server-side public-page source fetch
- Last-digit retention/transition analysis
- 3-ending and 4-ending pattern ranking
- Master/Core/Alternative/Reserve pools
- Candidate ticket engine
- Walk-forward backtesting
- JSON and CSV exports
- Mobile-friendly interface

## Run locally

Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Open the local address printed by Next.js, normally:

`http://localhost:3000`

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload this project.
3. Import the repository into Vercel.
4. Keep the default Next.js build settings.
5. Deploy.

The deployed site can then be opened from the Vercel URL on a phone or computer.

## Data sources

The source monitor is best-effort. Some lottery sites block automated requests or render results only with client-side JavaScript. If fetching fails, export/copy the results and import/paste them into Historical Results.

## Responsible use

Lottery outcomes are random. The application measures historical structure and organizes research selections. Scores, pools, patterns and backtests are not guarantees of future results or winning probability.

## v5 additions

- Game library tabs/grouping for UK/National Lottery and Gosloto/Stoloto profiles.
- AI Prompt Library tab with categorized prompts and copy buttons.
- Google Search Engine tab that opens searches on Google in a new browser tab.
- Official UK National Lottery and Stoloto source links are available where configured; some game pages may require manual paste/import because public pages can be JavaScript-rendered or block automated fetching.


## UK 49s 3/15 (15s)
LottoLab includes a dedicated **UK 49s 3/15 (15s)** game profile and source monitor configured for `https://49s.co.uk/15s/results`. The game supports 20/50/100-draw analysis windows, Hot & Cold, Best Numbers, Pairs/Triplets/Quads, Markov, zones, sections, backtesting, AI prompts and Google research. If the source page is JavaScript-rendered or blocks server fetching, use the source page's results and paste/export them into Historical Results.
