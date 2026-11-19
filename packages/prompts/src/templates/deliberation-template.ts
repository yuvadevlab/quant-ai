/**
 * @file packages/prompts/src/templates/deliberation-template.ts
 * @description Dynamic user prompt templates for adversarial trade deliberation.
 * @author yuva.devlab@gmail.com
 */

/**
 * User prompt template for evaluating an asset setup during multi-agent deliberation.
 */
export const DELIBERATION_USER_PROMPT_TEMPLATE = `EVALUATE TRADE CANDIDATE SETUP:
- Ticker Symbol: {{ticker}}
- Current Market Price: {{currentPrice}}
- Planned Target Price: {{targetPrice}}
- Mandatory Stop Loss: {{stopLossPrice}}
- Relative Strength Index (RSI 14): {{rsi}}
- Average True Range (ATR 14): {{atr}}
- Active Market Regime: {{regime}}
- Additional Market Context: {{context}}

Provide your structured deliberation verdict.`;
