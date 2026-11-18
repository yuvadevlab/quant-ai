/**
 * @file src/components/quantai/monitor.tsx
 * @description Workstation execution monitor featuring predictive trajectory cone and multi-agent consensus.
 */

import { Link } from "@tanstack/react-router";
import {
  AgentCard,
  InvalidationCard,
  MonitorKpiGrid,
  SignalHeader,
  TelemetryBar,
  TrajectoryConeChart,
} from "@quant-ai/ui";
import { Activity, ArrowLeft, Bot, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { chartSamples } from "./chart-samples";
import { signals } from "./data";
import { QuantLayout } from "./layout";

/**
 * Real-time signal execution monitor workstation desk.
 *
 * @param props - Unique signal ID to monitor.
 * @returns Rendered JSX MonitorWorkspace element.
 */
export function MonitorWorkspace({ signalId }: { signalId: string }) {
  const fallbackSignal = signals[0]!;
  const signal = signals.find((entry) => entry.id === signalId) ?? fallbackSignal;
  const isActive = signal.status === "Active";
  const [timeframe, setTimeframe] = useState("1m");

  return (
    <QuantLayout active="predictions">
      <div className="desk-container">
        {/* Navigation & Header */}
        <SignalHeader
          breadcrumb={
            <>
              <Link to="/predictions" className="breadcrumb-back-link">
                <ArrowLeft size={14} />
                <span>Prediction Ledger</span>
              </Link>
              <ChevronRight size={14} />
              <span className="current">{signal.id}</span>
            </>
          }
          symbol={signal.symbol}
          instrument={signal.instrument}
          direction={signal.direction}
          horizon={signal.horizon}
          companyName={signal.companyName}
          status={signal.status}
          isActive={isActive}
        />

        {/* Quote & Levels Grid */}
        <MonitorKpiGrid
          entry={signal.entry}
          entryPrice={signal.entryPrice}
          last={signal.last}
          change={signal.change}
          direction={signal.direction}
          target1={signal.target1}
          target2={signal.target2}
          stop={signal.stop}
          confidence={signal.confidence}
          riskReward={signal.riskReward}
        />

        {/* Trajectory Interactive Chart Panel */}
        <section className="desk-panel trajectory-panel">
          <div className="panel-heading">
            <div className="panel-title-wrap">
              <Activity size={18} className="panel-icon" />
              <div>
                <h2 className="panel-title">Real-time Predictive Trajectory Cone</h2>
                <p className="panel-subtext">
                  Actual price path vs. predicted confidence bounds and expected path to Target 1.
                </p>
              </div>
            </div>
            <div className="chart-tools">
              <div className="tab-pill-group">
                {["1m", "5m", "15m"].map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`tab-pill ${timeframe === period ? "active" : ""}`}
                    onClick={() => setTimeframe(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-legend-row">
            <span className="legend-item">
              <span className="legend-dot dot-actual" /> Actual Price
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-expected" /> Expected Path
            </span>
            <span className="legend-item">
              <span className="legend-box box-cone" /> Predictive Cone
            </span>
            <span className="legend-item">
              <span className="legend-line line-target" /> Target 1 ({signal.target1})
            </span>
            <span className="legend-item">
              <span className="legend-line line-stop" /> Stop Loss ({signal.stop})
            </span>
          </div>

          <TrajectoryConeChart
            symbol={signal.symbol}
            entryPrice={signal.entryPrice}
            target1={signal.target1}
            target2={signal.target2}
            stop={signal.stop}
            samples={chartSamples}
            isActive={isActive}
          />

          {/* Telemetry Row */}
          <TelemetryBar
            stats={[
              {
                label: "MAX FAVORABLE EXCURSION (MFE)",
                value: signal.mfe,
                subtext: "Peak ₹2,449.60",
                valueClass: "text-gain",
              },
              {
                label: "MAX ADVERSE EXCURSION (MAE)",
                value: signal.mae,
                subtext: "Trough ₹2,417.10",
                valueClass: "text-loss",
              },
              {
                label: "TRAJECTORY ALIGNMENT",
                value: "94.2%",
                subtext: "Within Upper Cone",
                valueClass: "text-gain",
              },
              {
                label: "PROGRESS TO TARGET 1",
                progressBarPercent: 68,
                subtext: "68% completed",
              },
            ]}
          />
        </section>

        {/* Multi-Agent Deliberation Panel */}
        <section className="desk-panel deliberation-panel">
          <div className="panel-heading">
            <div className="panel-title-wrap">
              <Bot size={18} className="panel-icon" />
              <div>
                <h2 className="panel-title">Multi-Agent Deliberation Breakdown</h2>
                <p className="panel-subtext">
                  Independent agent consensus. Each specialized model evaluates market dynamics
                  separately.
                </p>
              </div>
            </div>
            <span className="panel-status-pill">4 Specialized Agents</span>
          </div>

          <div className="agents-grid">
            <AgentCard
              role="TECHNICAL ANALYST"
              score={signal.agents.technical.score}
              scoreClass="text-gain"
              verdict={signal.agents.technical.verdict}
            />

            <AgentCard
              role="QUANT MOMENTUM"
              score={signal.agents.quant.score}
              scoreClass="text-gain"
              verdict={signal.agents.quant.verdict}
            />

            <AgentCard
              role="OPTIONS FLOW"
              score={signal.agents.optionsFlow.score}
              scoreClass="text-gain"
              verdict={signal.agents.optionsFlow.verdict}
            />

            <AgentCard
              role="RISK GUARDIAN"
              score={signal.agents.riskGuardian.score}
              scoreClass="text-brand"
              verdict={signal.agents.riskGuardian.verdict}
            />
          </div>
        </section>

        {/* Invalidation Rules & Catalysts */}
        <InvalidationCard
          title="Automated Invalidation Rule"
          description={
            <>
              If a 15-minute candle closes below <strong>{signal.stop}</strong> or if Call Open
              Interest surges by &gt; 35% on the immediate strike, the trade hypothesis is
              invalidated immediately.
            </>
          }
          action={
            <Link to="/chat" className="btn-secondary">
              <Sparkles size={14} />
              <span>Ask Copilot about {signal.symbol}</span>
            </Link>
          }
        />
      </div>
    </QuantLayout>
  );
}
