/**
 * @file packages/ui/src/types.ts
 * @description Standardized presentation data contracts for QuantAI institutional desk components.
 * Pure UI presentation interfaces decoupled from runtime API implementations and routers.
 * @author yuva.devlab@gmail.com
 */

/**
 * Signal presentation contract for tabular ledgers and spotlight grids.
 */
export interface TableSignalItem {
  readonly id: string;
  readonly symbol: string;
  readonly instrument: string;
  readonly companyName?: string;
  readonly direction: "BUY" | "SELL" | string;
  readonly horizon: string;
  readonly entry: string;
  readonly target1: string;
  readonly target2: string;
  readonly stop: string;
  readonly last: string;
  readonly status: "Active" | "Target hit" | "Stop loss hit" | "Expired" | string;
  readonly mfe: string;
  readonly mae: string;
  readonly time: string;
  readonly confidence?: string;
  readonly catalysts?: readonly string[];
}

/**
 * Screener row presentation contract.
 */
export interface ScreenerTableItem {
  readonly symbol: string;
  readonly name: string;
  readonly sector: string;
  readonly price: string;
  readonly change: string;
  readonly positive: boolean;
  readonly pattern: string;
  readonly rsi: number;
  readonly emaStatus: string;
  readonly oiAction: string;
  readonly volumeSurge: string;
  readonly signalCandidate: string;
}

/**
 * Portfolio open position item contract.
 */
export interface PositionItem {
  readonly symbol: string;
  readonly instrument: string;
  readonly side: "LONG" | "SHORT" | string;
  readonly qty: number;
  readonly entryPrice: number;
  readonly currentPrice: number;
  readonly pnl: number;
  readonly pnlPercent?: number;
  readonly stopLoss: number;
  readonly target?: number;
  readonly targetPrice?: number;
}

/**
 * Portfolio order execution audit log contract.
 */
export interface ExecutionItem {
  readonly id: string;
  readonly symbol: string;
  readonly type: "BUY" | "SELL" | string;
  readonly qty: number;
  readonly price?: number | string;
  readonly entryPrice?: number | string;
  readonly exitPrice?: number | string;
  readonly pnl?: number | string;
  readonly outcome?: string;
  readonly result?: string;
  readonly time?: string;
  readonly timestamp?: string;
}

/**
 * Market benchmark index tick contract.
 */
export interface IndexTickItem {
  readonly name: string;
  readonly exchange: string;
  readonly price: string;
  readonly change: string;
  readonly positive: boolean;
  readonly path: string;
  readonly category?: string;
  readonly isVix?: boolean;
}

/**
 * Market breadth and institutional flow summary contract.
 */
export interface MarketBreadthItem {
  readonly advances: number | string;
  readonly declines: number | string;
  readonly advanceRatio: string | number;
  readonly fiiNet: string;
  readonly diiNet: string;
}

/**
 * Sector momentum matrix row contract.
 */
export interface SectorItem {
  readonly name: string;
  readonly change: string;
  readonly momentum: string;
  readonly positive: boolean;
}

/**
 * Conversation message contract for Copilot chat thread.
 */
export interface ChatThreadMessage {
  readonly id: string | number;
  readonly type: "user" | "assistant" | string;
  readonly text: string;
  readonly time: string;
  readonly hasSignal?: boolean | undefined;
  readonly signalData?: TableSignalItem | undefined;
}

/**
 * AI Provider selection card contract for Settings desk.
 */
export interface SettingsProviderItem {
  readonly id: string;
  readonly name: string;
  readonly tag: string;
  readonly tagClass?: string;
  readonly desc: string;
  readonly contextWindow?: number;
  readonly isDeprecated?: boolean;
}

/**
 * Multi-agent specialist deliberation verdict item contract.
 */
export interface DeliberationAgentItem {
  readonly role: string;
  readonly score: number;
  readonly scoreClass?: string;
  readonly verdict: string;
}
