import { SignalStatus as CoreSignalStatus } from "@quant-ai/shared-types";

export const UiSignalStatus = {
  ACTIVE: "Active",
  TARGET_HIT: "Target hit",
  STOP_HIT: "Stop loss hit",
  EXPIRED: "Expired",
} as const;

export type UiSignalStatus = (typeof UiSignalStatus)[keyof typeof UiSignalStatus];
export type SignalStatus = UiSignalStatus | CoreSignalStatus;

export const UiSignalDirection = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export type UiSignalDirection = (typeof UiSignalDirection)[keyof typeof UiSignalDirection];

export const UiSignalHorizon = {
  INTRADAY: "Intraday",
  SWING: "Swing",
  OPTIONS: "Options",
  SCALP: "Scalp",
} as const;

export type UiSignalHorizon = (typeof UiSignalHorizon)[keyof typeof UiSignalHorizon];
export type SignalHorizon = UiSignalHorizon;

export interface Signal {
  id: string;
  symbol: string;
  companyName: string;
  instrument: string;
  direction: UiSignalDirection | "BUY" | "SELL";
  horizon: UiSignalHorizon | "Intraday" | "Swing" | "Options" | "Scalp";
  entry: string;
  entryPrice: number;
  target1: string;
  target2: string;
  stop: string;
  last: string;
  change: string;
  mfe: string;
  mae: string;
  status: SignalStatus;
  time: string;
  confidence: string;
  riskReward: string;
  catalysts: string[];
  agents: {
    technical: { score: number; verdict: string };
    quant: { score: number; verdict: string };
    optionsFlow: { score: number; verdict: string };
    riskGuardian: { score: number; verdict: string };
  };
  trajectoryPoints?: {
    time: string;
    actualPrice: number;
    upperCone: number;
    expectedPath: number;
    lowerCone: number;
  }[];
}

export const signals: Signal[] = [
  {
    id: "PRED-8942",
    symbol: "RELIANCE",
    companyName: "Reliance Industries Ltd",
    instrument: "NSE · Cash Equity",
    direction: "BUY",
    horizon: "Intraday",
    entry: "₹2,420–2,425",
    entryPrice: 2422.5,
    target1: "₹2,455",
    target2: "₹2,480",
    stop: "₹2,402",
    last: "₹2,434.60",
    change: "+0.50%",
    mfe: "+1.18%",
    mae: "−0.18%",
    status: "Active",
    time: "Today 09:45 IST",
    confidence: "84%",
    riskReward: "1:2.6",
    catalysts: ["20 EMA Bounce", "Volume Expansion +42%", "Heavy Call Unwinding"],
    agents: {
      technical: { score: 86, verdict: "Bullish divergence on 15m RSI; clean reclaim of VWAP." },
      quant: { score: 83, verdict: "Z-score mean reversion signal triggered at -2.1 SD." },
      optionsFlow: { score: 85, verdict: "2400 PE additions +2.4M contracts; 2450 CE covering." },
      riskGuardian: {
        score: 82,
        verdict: "Risk defined at 0.85% capital; invalidation at ₹2,402.",
      },
    },
    trajectoryPoints: [
      {
        time: "09:45",
        actualPrice: 2422.5,
        expectedPath: 2422.5,
        upperCone: 2435,
        lowerCone: 2415,
      },
      {
        time: "10:00",
        actualPrice: 2426.0,
        expectedPath: 2428.0,
        upperCone: 2442,
        lowerCone: 2416,
      },
      {
        time: "10:15",
        actualPrice: 2429.5,
        expectedPath: 2433.0,
        upperCone: 2448,
        lowerCone: 2418,
      },
      {
        time: "10:30",
        actualPrice: 2432.0,
        expectedPath: 2438.0,
        upperCone: 2455,
        lowerCone: 2420,
      },
      {
        time: "10:45",
        actualPrice: 2434.6,
        expectedPath: 2443.0,
        upperCone: 2462,
        lowerCone: 2422,
      },
      {
        time: "11:00",
        actualPrice: 2434.6,
        expectedPath: 2448.0,
        upperCone: 2470,
        lowerCone: 2424,
      },
      {
        time: "11:15",
        actualPrice: 2434.6,
        expectedPath: 2455.0,
        upperCone: 2480,
        lowerCone: 2425,
      },
    ],
  },
  {
    id: "PRED-8941",
    symbol: "BANKNIFTY",
    companyName: "Nifty Bank Index Derivative",
    instrument: "NSE · 51,200 CE",
    direction: "BUY",
    horizon: "Options",
    entry: "₹386–392",
    entryPrice: 389,
    target1: "₹435",
    target2: "₹470",
    stop: "₹360",
    last: "₹412.40",
    change: "+2.15%",
    mfe: "+2.40%",
    mae: "−0.30%",
    status: "Active",
    time: "Today 09:38 IST",
    confidence: "82%",
    riskReward: "1:2.8",
    catalysts: ["Expiry Gamma Squeeze", "Put Writing at 51,000", "HDFC Bank Reversal"],
    agents: {
      technical: {
        score: 84,
        verdict: "Opening range breakout with volume 1.8x 20-period average.",
      },
      quant: { score: 81, verdict: "Delta neutral flow shifted positive by 1,420 contracts." },
      optionsFlow: {
        score: 88,
        verdict: "51,000 PE OI surge of 38% confirms solid intraday floor.",
      },
      riskGuardian: { score: 76, verdict: "High IV environment; sized to 1.2% risk threshold." },
    },
    trajectoryPoints: [
      { time: "09:38", actualPrice: 389, expectedPath: 389, upperCone: 405, lowerCone: 375 },
      { time: "09:50", actualPrice: 396, expectedPath: 400, upperCone: 418, lowerCone: 378 },
      { time: "10:05", actualPrice: 404, expectedPath: 412, upperCone: 432, lowerCone: 382 },
      { time: "10:20", actualPrice: 409, expectedPath: 422, upperCone: 445, lowerCone: 385 },
      { time: "10:35", actualPrice: 412.4, expectedPath: 435, upperCone: 458, lowerCone: 388 },
    ],
  },
  {
    id: "PRED-8939",
    symbol: "HDFCBANK",
    companyName: "HDFC Bank Ltd",
    instrument: "NSE · Cash Equity",
    direction: "SELL",
    horizon: "Intraday",
    entry: "₹1,742–1,747",
    entryPrice: 1744.5,
    target1: "₹1,718",
    target2: "₹1,704",
    stop: "₹1,760",
    last: "₹1,736.80",
    change: "−0.44%",
    mfe: "+0.68%",
    mae: "−0.12%",
    status: "Active",
    time: "Today 09:32 IST",
    confidence: "74%",
    riskReward: "1:2.4",
    catalysts: ["Resistance Rejection ₹1,750", "Banking Sector Weakness", "Trading Below VWAP"],
    agents: {
      technical: { score: 78, verdict: "Double top at ₹1,752; breakdown below 50 EMA on 5m." },
      quant: { score: 72, verdict: "Momentum histogram flipping negative; volume confirmation." },
      optionsFlow: { score: 75, verdict: "1760 CE aggressive call writing noticed." },
      riskGuardian: { score: 71, verdict: "Tight stop at ₹1,760; risk capped at ₹15.5 per share." },
    },
  },
  {
    id: "PRED-8937",
    symbol: "TATASTEEL",
    companyName: "Tata Steel Ltd",
    instrument: "NSE · Cash Equity",
    direction: "BUY",
    horizon: "Swing",
    entry: "₹158.60–159.20",
    entryPrice: 158.9,
    target1: "₹164.50",
    target2: "₹169.00",
    stop: "₹155.80",
    last: "₹160.80",
    change: "+1.20%",
    mfe: "+1.35%",
    mae: "−0.15%",
    status: "Active",
    time: "Today 09:18 IST",
    confidence: "79%",
    riskReward: "1:3.2",
    catalysts: ["Metal Index Outperformance", "Multi-week Range Breakout", "FII Sector Inflow"],
    agents: {
      technical: { score: 82, verdict: "Daily candle closing above 200 SMA with rising OBV." },
      quant: { score: 80, verdict: "Sector momentum ranking #1 in Indian equity space today." },
      optionsFlow: { score: 77, verdict: "160 CE breakout volume at 2.4x standard." },
      riskGuardian: {
        score: 78,
        verdict: "Swing horizon 3-5 sessions; trailing stop active at ₹157.5.",
      },
    },
  },
  {
    id: "PRED-8928",
    symbol: "NIFTY 50",
    companyName: "National Stock Exchange Benchmark",
    instrument: "NSE · Index Futures",
    direction: "BUY",
    horizon: "Intraday",
    entry: "24,102–24,118",
    entryPrice: 24110,
    target1: "24,185",
    target2: "24,220",
    stop: "24,068",
    last: "24,188.50",
    change: "+0.32%",
    mfe: "+0.38%",
    mae: "−0.08%",
    status: "Target hit",
    time: "Today 09:06 IST",
    confidence: "81%",
    riskReward: "1:2.1",
    catalysts: ["Opening Range Reclaim", "Futures Premium Expansion", "Broad Market Breadth"],
    agents: {
      technical: { score: 84, verdict: "Target 1 hit at 24,185. Partial profit locked." },
      quant: { score: 80, verdict: "Trend continuation probable towards 24,220 target 2." },
      optionsFlow: { score: 82, verdict: "Heavy call unwinding between 24,100 - 24,150." },
      riskGuardian: { score: 86, verdict: "Stop loss automatically shifted to cost entry 24,110." },
    },
  },
  {
    id: "PRED-8913",
    symbol: "TCS",
    companyName: "Tata Consultancy Services Ltd",
    instrument: "NSE · Cash Equity",
    direction: "BUY",
    horizon: "Swing",
    entry: "₹3,814–3,826",
    entryPrice: 3820,
    target1: "₹3,875",
    target2: "₹3,910",
    stop: "₹3,785",
    last: "₹3,785.00",
    change: "−0.91%",
    mfe: "+0.18%",
    mae: "−0.91%",
    status: "Stop loss hit",
    time: "Yesterday 14:12 IST",
    confidence: "69%",
    riskReward: "1:2.0",
    catalysts: ["Pullback Support", "IT Sector Rebound", "Earnings Reaction"],
    agents: {
      technical: { score: 66, verdict: "Broke below support level; clean stop execution." },
      quant: { score: 68, verdict: "Risk model exited position strictly at designated stop." },
      optionsFlow: { score: 65, verdict: "Institutional selling detected across global IT peers." },
      riskGuardian: { score: 92, verdict: "Loss contained precisely to 0.91%; capital preserved." },
    },
  },
  {
    id: "PRED-8908",
    symbol: "ICICIBANK",
    companyName: "ICICI Bank Ltd",
    instrument: "NSE · Cash Equity",
    direction: "BUY",
    horizon: "Swing",
    entry: "₹1,312–1,320",
    entryPrice: 1316,
    target1: "₹1,355",
    target2: "₹1,378",
    stop: "₹1,296",
    last: "₹1,358.40",
    change: "+1.72%",
    mfe: "+1.85%",
    mae: "−0.14%",
    status: "Target hit",
    time: "Yesterday 13:44 IST",
    confidence: "80%",
    riskReward: "1:2.9",
    catalysts: ["Higher High Structure", "Put OI Support at 1300", "Relative Strength vs Nifty"],
    agents: {
      technical: { score: 83, verdict: "Target 1 achieved (+₹39/share); trailing T2." },
      quant: { score: 81, verdict: "Strong momentum score 8.4/10." },
      optionsFlow: { score: 84, verdict: "Institutional block deals reported on NSE." },
      riskGuardian: { score: 88, verdict: "Position risk zeroed; guaranteed profitable trade." },
    },
  },
  {
    id: "PRED-8872",
    symbol: "INFY",
    companyName: "Infosys Ltd",
    instrument: "NSE · Cash Equity",
    direction: "SELL",
    horizon: "Intraday",
    entry: "₹1,509–1,513",
    entryPrice: 1511,
    target1: "₹1,492",
    target2: "₹1,481",
    stop: "₹1,521",
    last: "₹1,506.20",
    change: "−0.19%",
    mfe: "+0.44%",
    mae: "−0.20%",
    status: "Expired",
    time: "18 Nov 14:26 IST",
    confidence: "72%",
    riskReward: "1:2.4",
    catalysts: ["Lower High Formation", "Supply Zone Overhead", "Weak IT Sector Breadth"],
    agents: {
      technical: {
        score: 71,
        verdict: "Session closed before hitting targets; auto-expired at 15:25.",
      },
      quant: { score: 70, verdict: "Time decay threshold exceeded." },
      optionsFlow: { score: 72, verdict: "Neutral positioning into closing bell." },
      riskGuardian: { score: 85, verdict: "Position closed flat with negligible variance." },
    },
  },
];

export const marketTicks = [
  {
    name: "NIFTY 50",
    exchange: "NSE",
    price: "24,188.50",
    change: "+86.20 (+0.36%)",
    changeValue: 86.2,
    positive: true,
    dayHigh: "24,215.80",
    dayLow: "24,088.10",
    path: "0,14 12,11 24,13 36,5 48,9 60,2",
  },
  {
    name: "BANKNIFTY",
    exchange: "NSE",
    price: "51,240.80",
    change: "+112.40 (+0.22%)",
    changeValue: 112.4,
    positive: true,
    dayHigh: "51,350.00",
    dayLow: "50,980.20",
    path: "0,12 12,8 24,14 36,10 48,6 60,3",
  },
  {
    name: "MIDCPNIFTY",
    exchange: "NSE",
    price: "12,875.40",
    change: "+105.10 (+0.82%)",
    changeValue: 105.1,
    positive: true,
    dayHigh: "12,902.00",
    dayLow: "12,740.00",
    path: "0,15 12,12 24,9 36,11 48,5 60,1",
  },
  {
    name: "SENSEX",
    exchange: "BSE",
    price: "79,842.10",
    change: "+248.50 (+0.31%)",
    changeValue: 248.5,
    positive: true,
    dayHigh: "79,980.00",
    dayLow: "79,510.00",
    path: "0,13 12,10 24,11 36,6 48,8 60,4",
  },
  {
    name: "INDIA VIX",
    exchange: "NSE",
    price: "13.48",
    change: "−0.42 (−3.02%)",
    changeValue: -0.42,
    positive: false,
    dayHigh: "14.10",
    dayLow: "13.35",
    path: "0,3 12,6 24,4 36,11 48,9 60,14",
    isVix: true,
  },
];

export const marketBreadth = {
  advances: 1482,
  declines: 648,
  unchanged: 84,
  advanceRatio: "69.5%",
  fiiNet: "+₹2,145 Cr",
  diiNet: "+₹1,280 Cr",
  regime: "Institutional Accumulation",
  regimeType: "Bullish",
  volatilityEnv: "Low Volatility (VIX 13.48)",
};

export const sectorPerformance = [
  { name: "Nifty PSU Bank", change: "+2.15%", positive: true, momentum: "Strong" },
  { name: "Nifty IT", change: "+1.84%", positive: true, momentum: "Strong" },
  { name: "Nifty Auto", change: "+1.22%", positive: true, momentum: "Moderate" },
  { name: "Nifty Metal", change: "+0.95%", positive: true, momentum: "Moderate" },
  { name: "Nifty Pharma", change: "+0.44%", positive: true, momentum: "Neutral" },
  { name: "Nifty Energy", change: "+0.18%", positive: true, momentum: "Neutral" },
  { name: "Nifty FMCG", change: "−0.32%", positive: false, momentum: "Weak" },
  { name: "Nifty Realty", change: "−0.65%", positive: false, momentum: "Weak" },
];

export const EmaStatus = {
  ABOVE_20_50: "Above 20/50",
  EMA_BULLISH_CROSS: "EMA Bullish Cross",
  BELOW_50_EMA: "Below 50 EMA",
  EMA_REJECTION: "EMA Rejection",
} as const;

export type EmaStatus = (typeof EmaStatus)[keyof typeof EmaStatus] | string;

export const OiAction = {
  LONG_BUILDUP: "Long Buildup",
  SHORT_COVERING: "Short Covering",
  SHORT_BUILDUP: "Short Buildup",
  UNWINDING: "Unwinding",
} as const;

export type OiAction = (typeof OiAction)[keyof typeof OiAction] | string;

export const SignalCandidate = {
  STRONG_BUY: "Strong BUY",
  BUY: "BUY",
  NEUTRAL: "Neutral",
  SELL: "SELL",
} as const;

export type SignalCandidate = (typeof SignalCandidate)[keyof typeof SignalCandidate] | string;

export interface ScreenerItem {
  symbol: string;
  name: string;
  sector: string;
  price: string;
  change: string;
  positive: boolean;
  rsi: number;
  emaStatus: EmaStatus;
  oiAction: OiAction;
  volumeSurge: string;
  pattern: string;
  signalCandidate: SignalCandidate;
}

export const screenerItems: ScreenerItem[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sector: "Energy",
    price: "₹2,434.60",
    change: "+0.50%",
    positive: true,
    rsi: 63.4,
    emaStatus: "Above 20/50",
    oiAction: "Short Covering",
    volumeSurge: "+42%",
    pattern: "Ascending Triangle Breakout",
    signalCandidate: "Strong BUY",
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel",
    sector: "Metals",
    price: "₹160.80",
    change: "+1.20%",
    positive: true,
    rsi: 68.2,
    emaStatus: "EMA Bullish Cross",
    oiAction: "Long Buildup",
    volumeSurge: "+58%",
    pattern: "Multi-week Range Expansion",
    signalCandidate: "Strong BUY",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    sector: "PSU Banking",
    price: "₹824.50",
    change: "+2.30%",
    positive: true,
    rsi: 71.0,
    emaStatus: "Above 20/50",
    oiAction: "Long Buildup",
    volumeSurge: "+85%",
    pattern: "Flag & Pole Continuation",
    signalCandidate: "Strong BUY",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    sector: "IT",
    price: "₹1,506.20",
    change: "−0.19%",
    positive: false,
    rsi: 48.5,
    emaStatus: "Below 50 EMA",
    oiAction: "Unwinding",
    volumeSurge: "−12%",
    pattern: "Pullback to Support",
    signalCandidate: "Neutral",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    sector: "Telecom",
    price: "₹1,684.00",
    change: "+1.15%",
    positive: true,
    rsi: 64.8,
    emaStatus: "Above 20/50",
    oiAction: "Long Buildup",
    volumeSurge: "+34%",
    pattern: "All-Time High Consolidation",
    signalCandidate: "BUY",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sector: "Banking",
    price: "₹1,736.80",
    change: "−0.44%",
    positive: false,
    rsi: 44.2,
    emaStatus: "EMA Rejection",
    oiAction: "Short Buildup",
    volumeSurge: "+28%",
    pattern: "Resistance Rejection",
    signalCandidate: "SELL",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    sector: "Infrastructure",
    price: "₹3,540.00",
    change: "+0.88%",
    positive: true,
    rsi: 59.4,
    emaStatus: "Above 20/50",
    oiAction: "Long Buildup",
    volumeSurge: "+22%",
    pattern: "Cup with Handle",
    signalCandidate: "BUY",
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki",
    sector: "Auto",
    price: "₹11,450.00",
    change: "+1.65%",
    positive: true,
    rsi: 66.5,
    emaStatus: "Above 20/50",
    oiAction: "Short Covering",
    volumeSurge: "+45%",
    pattern: "Bullish Channel Rebound",
    signalCandidate: "Strong BUY",
  },
];

export interface PortfolioPosition {
  symbol: string;
  instrument: string;
  side: "LONG" | "SHORT";
  qty: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss: number;
  target: number;
  status: "OPEN" | "CLOSED";
}

export const paperPortfolio = {
  totalEquity: 1048200,
  initialCapital: 1000000,
  realizedPnl: 35750,
  unrealizedPnl: 12450,
  availableMargin: 684000,
  marginUsed: 364200,
  winRate: "78.4%",
  positions: [
    {
      symbol: "RELIANCE",
      instrument: "NSE · Cash",
      side: "LONG" as const,
      qty: 100,
      entryPrice: 2422.5,
      currentPrice: 2434.6,
      pnl: 1210,
      pnlPercent: 0.5,
      stopLoss: 2402,
      target: 2455,
      status: "OPEN" as const,
    },
    {
      symbol: "BANKNIFTY 51,200 CE",
      instrument: "NSE · Weekly Options",
      side: "LONG" as const,
      qty: 60,
      entryPrice: 389,
      currentPrice: 412.4,
      pnl: 1404,
      pnlPercent: 6.01,
      stopLoss: 360,
      target: 435,
      status: "OPEN" as const,
    },
    {
      symbol: "TATASTEEL",
      instrument: "NSE · Cash",
      side: "LONG" as const,
      qty: 800,
      entryPrice: 158.9,
      currentPrice: 160.8,
      pnl: 1520,
      pnlPercent: 1.2,
      stopLoss: 155.8,
      target: 164.5,
      status: "OPEN" as const,
    },
  ],
  recentExecutions: [
    {
      id: "ORD-9411",
      symbol: "NIFTY 50 Futures",
      type: "BUY",
      qty: 50,
      price: "24,110",
      exitPrice: "24,185",
      pnl: "+₹3,750",
      result: "Target 1 Hit",
      time: "Today 10:14",
    },
    {
      id: "ORD-9402",
      symbol: "ICICIBANK",
      type: "BUY",
      qty: 200,
      price: "₹1,316",
      exitPrice: "₹1,355",
      pnl: "+₹7,800",
      result: "Target 1 Hit",
      time: "Yesterday 15:10",
    },
    {
      id: "ORD-9390",
      symbol: "TCS",
      type: "BUY",
      qty: 50,
      price: "₹3,820",
      exitPrice: "₹3,785",
      pnl: "−₹1,750",
      result: "Stop Loss Hit",
      time: "Yesterday 14:45",
    },
  ],
};

export const watchlist = [
  { name: "NIFTY 50", price: "24,188.50", change: "+0.36%", positive: true },
  { name: "BANKNIFTY", price: "51,240.80", change: "+0.22%", positive: true },
  { name: "RELIANCE", price: "2,434.60", change: "+0.50%", positive: true },
  { name: "HDFCBANK", price: "1,736.80", change: "−0.44%", positive: false },
  { name: "TATASTEEL", price: "160.80", change: "+1.20%", positive: true },
  { name: "SBIN", price: "824.50", change: "+2.30%", positive: true },
  { name: "INFY", price: "1,506.20", change: "−0.19%", positive: false },
];
