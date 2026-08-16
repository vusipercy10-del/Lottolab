# LottoLab Deployment Guide

## Fastest local option
1. Install Node.js 20+.
2. Extract the project ZIP.
3. Open a terminal in `LottoLab-Master-System`.
4. Run:
   `npm install`
5. Run:
   `npm run dev`
6. Open:
   `http://localhost:3000`

## Windows
Double-click `start-lottolab.bat` after Node.js is installed.

## Mac/Linux
Run:
`chmod +x start-lottolab.sh`
then:
`./start-lottolab.sh`

## Vercel
The project is structured for Next.js and is ready to be connected to a Vercel project.

Recommended deployment:
1. Create a GitHub repository named `lottolab-master-system`.
2. Upload the contents of this folder to the repository.
3. In Vercel, import the GitHub repository.
4. Keep the detected framework as Next.js.
5. Deploy.
6. Vercel will provide a public `.vercel.app` address.

## Important
The current source-monitor endpoint is best-effort. Some public lottery sites block automated requests or render results dynamically. The application therefore supports manual CSV/TXT import so analysis does not depend on a single website.

## Production checklist
- Connect a persistent database for saved draws.
- Add scheduled result ingestion where legally/technically permitted.
- Add authentication if private workspaces are required.
- Add rate limits and caching to external data sources.
- Add automated CI build/test checks.
