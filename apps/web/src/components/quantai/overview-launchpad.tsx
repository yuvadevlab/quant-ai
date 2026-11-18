/**
 * @file apps/web/src/components/quantai/overview-launchpad.tsx
 * @description Workstation module navigation hub cards.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, ScanLine, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

/**
 * Renders quick navigation cards for QuantAI workstation modules.
 *
 * @returns Rendered JSX WorkstationLaunchpad element.
 */
export function WorkstationLaunchpad() {
  return (
    <section className="launchpad-section">
      <h2 className="launchpad-title">Workstation Modules</h2>
      <div className="launchpad-grid">
        <Link to="/predictions" className="launchpad-card">
          <div className="launchpad-icon-box box-predictions">
            <TrendingUp size={22} />
          </div>
          <div className="launchpad-info">
            <h3>Prediction Lab & Audit Ledger</h3>
            <p>
              Comprehensive log of all automated AI trading recommendations, win-rate tracking, and
              MFE/MAE excursion measurements.
            </p>
          </div>
          <span className="launchpad-link-action">
            Open Ledger <ArrowRight size={14} />
          </span>
        </Link>

        <Link to="/screener" className="launchpad-card">
          <div className="launchpad-icon-box box-screener">
            <ScanLine size={22} />
          </div>
          <div className="launchpad-info">
            <h3>Quantitative Market Screener</h3>
            <p>
              Scan 2,000+ Indian equities and F&O contracts for technical breakouts, 20/50 EMA
              crosses, and aggressive options OI build-up.
            </p>
          </div>
          <span className="launchpad-link-action">
            Run Screener <ArrowRight size={14} />
          </span>
        </Link>

        <Link to="/portfolio" className="launchpad-card">
          <div className="launchpad-icon-box box-portfolio">
            <ShieldCheck size={22} />
          </div>
          <div className="launchpad-info">
            <h3>Paper Trading & Risk Management</h3>
            <p>
              Simulate algorithmic execution with virtual ₹10,00,000 capital, automated trailing
              stops, and portfolio drawdown protection.
            </p>
          </div>
          <span className="launchpad-link-action">
            View Portfolio <ArrowRight size={14} />
          </span>
        </Link>

        <Link to="/chat" className="launchpad-card">
          <div className="launchpad-icon-box box-copilot">
            <Sparkles size={22} />
          </div>
          <div className="launchpad-info">
            <h3>AI Financial Copilot</h3>
            <p>
              Interactive multi-agent financial dialogue. Query technical setups, options chain
              structures, and market regime hypotheses.
            </p>
          </div>
          <span className="launchpad-link-action">
            Start Chat <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
