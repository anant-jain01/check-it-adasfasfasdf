// /api/quotes.js  — Vercel serverless proxy for Yahoo Finance
// No API key needed. Runs server-side so CORS is never an issue.
// Your frontend calls: fetch('/api/quotes')

export default async function handler(req, res) {
  // Allow your site to call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const symbols = [
    { yf: '%5EBSESN',     label: 'SENSEX'     },
    { yf: '%5ENSEI',      label: 'NIFTY 50'   },
    { yf: '%5ENSEBANK',   label: 'BANK NIFTY' },
    { yf: 'RELIANCE.NS',  label: 'RELIANCE'   },
    { yf: 'TCS.NS',       label: 'TCS'        },
    { yf: 'HDFCBANK.NS',  label: 'HDFC BANK'  },
    { yf: 'INFY.NS',      label: 'INFOSYS'    },
    { yf: 'ICICIBANK.NS', label: 'ICICI BANK' },
    { yf: 'SBIN.NS',      label: 'SBI'        },
  ];

  async function fetchQuote({ yf, label }) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yf}?interval=1d&range=1d`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });
    if (!r.ok) throw new Error(`YF ${r.status} for ${yf}`);
    const json = await r.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) throw new Error(`No data for ${yf}`);
    return {
      label,
      price:  meta.regularMarketPrice,
      change: meta.regularMarketChangePercent ?? 0,
    };
  }

  const results = await Promise.allSettled(symbols.map(fetchQuote));
  const quotes  = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  if (!quotes.length) {
    return res.status(502).json({ error: 'All quotes failed' });
  }

  // Cache for 60 seconds on Vercel's CDN edge
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
  res.status(200).json({ quotes });
} 