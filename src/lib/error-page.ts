/**
 * @file src/lib/error-page.ts
 * @description Standalone HTML fallback page for catastrophic server exceptions.
 * @author yuva.devlab@gmail.com
 */

/**
 * Generates an accessible, branded dark fallback error document.
 *
 * @returns Fully qualified HTML document string
 */
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>QuantAI — Server Recovery</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #080C14;
        color: #F9FAFB;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .card {
        max-width: 32rem;
        width: 100%;
        text-align: center;
        padding: 2.5rem;
        background: #111827;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
      }
      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: rgba(239, 68, 68, 0.15);
        color: #EF4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        margin-bottom: 1rem;
        letter-spacing: 0.05em;
      }
      h1 { font-size: 1.5rem; margin: 0 0 0.75rem; font-weight: 700; }
      p { color: #9CA3AF; margin: 0 0 1.75rem; font-size: 0.9375rem; line-height: 1.6; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        padding: 0.625rem 1.25rem;
        border-radius: 8px;
        font: inherit;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
        transition: all 0.15s ease;
      }
      .primary {
        background: #06B6D4;
        color: #080C14;
      }
      .primary:hover {
        background: #22D3EE;
      }
      .secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #F9FAFB;
        border-color: rgba(255, 255, 255, 0.12);
      }
      .secondary:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">SYSTEM RESILIENCE</span>
      <h1>Workstation Session Interrupted</h1>
      <p>An unexpected upstream server exception occurred. The quantitative analytics engine is attempting to reconnect to the market feed.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Reconnect Workstation</button>
        <a class="secondary" href="/">Return to Market Desk</a>
      </div>
    </div>
  </body>
</html>`;
}
