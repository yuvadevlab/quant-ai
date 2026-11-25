/**
 * @file packages/prompts/src/guardrails/copilot-guardrail.patterns.ts
 * @description Centralized prompt-injection and financial-domain boundary patterns for QuantAI Copilot.
 * @author yuva.devlab@gmail.com
 */

/**
 * Regex rules detecting instruction overrides, persona jailbreaks, credential/prompt exfiltration,
 * and delimiter spoofing attempts.
 */
export const COPILOT_INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(all\s+|previous\s+|prior\s+|above\s+)?(instructions|rules|prompts|directives)/i,
  /disregard\s+(all\s+|your\s+|previous\s+)?(instructions|rules|prompts|guidelines)/i,
  /forget\s+(everything|all\s+previous|your\s+instructions)/i,
  /(override|bypass|disable)\s+(your\s+)?(system|safety|security|guardrails|rules|filters)/i,
  /you\s+are\s+now\s+(dan|unrestricted|jailbroken|free\s+from|no\s+longer)/i,
  /act\s+as\s+(an?\s+)?(unrestricted|unfiltered|jailbroken)/i,
  /(reveal|show|print|output|repeat|dump|leak|expose)\b.{0,35}\b(system\s+prompt|developer\s+prompt|hidden\s+instructions|api\s+key|secret|credentials|env\b|database_url)/i,
  /(?:^|\n)\s*(?:system|developer)\s*:\s*/i,
  /<\|(?:im_start|im_end|system|endoftext)\|>/i,
  /\[\/?INST\]/i,
  /<\/?trader_query>/i,
];

/**
 * Matches brief conversational greetings allowed to pass through to Copilot.
 */
export const COPILOT_GREETING_PATTERN =
  /^(hi|hello|hey|good\s+(morning|afternoon|evening)|greetings)[!.\s]*$/i;

/**
 * Matches quantitative finance, market structure, derivatives, and trading terminology.
 */
export const COPILOT_FINANCE_DOMAIN_PATTERN =
  /\b(market|markets|stock|stocks|equity|equities|share|shares|index|indices|nifty|sensex|banknifty|vix|nse|bse|sebi|rbi|fii|dii|trade|trading|trader|invest|investing|investment|portfolio|position|sizing|kelly|sharpe|sortino|drawdown|volatility|momentum|swing|scalp|intraday|breakout|reversal|trend|support|resistance|candle|candles|ohlc|volume|rsi|macd|ema|sma|atr|vwap|bollinger|option|options|chain|pcr|oi|iv|greeks|delta|gamma|theta|vega|strike|expiry|call|put|straddle|strangle|iron\s+condor|hedge|hedging|future|futures|arbitrage|backtest|quant|quantitative|alpha|beta|var|risk|reward|stop\s*loss|target|earnings|revenue|ebitda|valuation|p\/e|pe|pb|roe|dividend|macro|inflation|gdp|yield|bond|bonds|treasury|forex|currency|usd|inr|commodity|gold|crude|crypto|bitcoin|btc|etf|ipo|chart|signal|prediction|screener)\b/i;

/**
 * Matches clearly off-topic non-financial requests.
 */
export const COPILOT_EXPLICIT_OFF_TOPIC_PATTERN =
  /\b(recipe|cook|cooking|bake|baking|cake|pasta|pizza|poem|poetry|write\s+a\s+story|novel|song|lyrics|movie|film|horoscope|astrology|medical|diagnose|symptom|prescription|homework|essay|translate\s+this|joke|riddle|python\s+script\s+for\s+game|html\s+game)\b/i;
