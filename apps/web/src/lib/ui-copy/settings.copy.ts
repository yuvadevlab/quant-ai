/**
 * @file src/lib/ui-copy/settings.copy.ts
 * @description Centralized copy for the System Settings & Algorithm Tuning Desk.
 */

export const SETTINGS_COPY = {
  HEADER: {
    BREADCRUMB_WORKSTATION: "WORKSTATION",
    TITLE: "System Settings & Algorithmic Parameters",
    SUBTITLE:
      "Configure quantitative models, API endpoints, risk thresholds, and deliberation committee parameters.",
    SAVE_BTN: "Save Configuration",
    SAVED_BTN: "Preferences Saved",
  },
  SECTIONS: {
    ENGINE: {
      TITLE: "AI Engine & Model Provider",
      SUBTITLE: "Switch between multi-provider backends. Dynamic runtime abstraction layer.",
      PROVIDER_LABEL: "Default AI Provider",
      TEMPERATURE_LABEL: "Temperature (Sampling Diversity)",
    },
    RISK: {
      TITLE: "Deterministic Risk Limits",
      SUBTITLE:
        "Deterministic safety thresholds enforced by Risk Guardian. Autonomous agents cannot override these rules.",
      MAX_RISK_LABEL: "Max Risk Per Signal",
      MAX_RISK_SUBTITLE: "Maximum allowable capital risk per single trade recommendation.",
      MAX_RISK_OPTIONS: {
        CONSERVATIVE: "0.5% (Conservative)",
        STANDARD: "1.0% (Standard Quantitative)",
        AGGRESSIVE: "1.5% (Aggressive)",
        CEILING: "2.0% (Max Ceiling)",
      },
      DRAWDOWN_LABEL: "Daily Max Drawdown Circuit Breaker",
      DRAWDOWN_SUBTITLE: "Auto-pause all signal generation if daily losses hit this threshold.",
      DRAWDOWN_OPTIONS: {
        LOSS_2: "2.0% Daily Loss",
        LOSS_3: "3.0% Daily Loss (Default)",
        LOSS_5: "5.0% Daily Loss",
      },
      TRAILING_LABEL: "Automated Trailing Stop Loss",
      TRAILING_SUBTITLE:
        "Automatically advance stop loss to entry level once Target 1 is achieved.",
      MIN_RR_LABEL: "Minimum Risk:Reward Ratio",
      MAX_ALLOCATION_LABEL: "Max Capital Allocation per Signal (%)",
    },
    SSO: {
      TITLE: "DevLab Portal SSO & Identity",
      SUBTITLE: "Centralized authentication across Yuva DevLab ecosystem.",
      LABEL_STATUS: "AUTHENTICATION STATUS",
      STATUS_TEXT: "Authenticated via DevLab Portal SSO",
      UNAUTH_STATUS_TEXT: "Unauthenticated (SSO Guest Session)",
      LABEL_ACCOUNT: "LINKED ACCOUNT",
      LABEL_USER_ID: "PORTAL USER ID (SUB)",
      LABEL_ROLE: "ROLE & ACCESS",
      LABEL_THEME: "ECOSYSTEM APP THEME",
      THEME_DARK: "QuantAI Dark (Institutional Cyan)",
      THEME_LIGHT: "QuantAI Light (Executive Desk)",
      BTN_LOGOUT: "Sign Out from DevLab Ecosystem",
      BTN_LOGIN: "Sign In via DevLab Portal SSO",
    },
    DATA: {
      TITLE: "Live Market Feed & WebSocket",
      SUBTITLE: "Telemetry cadence and historical candle lookback settings.",
      TICK_CADENCE_LABEL: "Tick Streaming Cadence (ms)",
      CANDLE_LOOKBACK_LABEL: "Historical Candle Lookback (Days)",
    },
  },
  ACTIONS: {
    SAVE: "Save Configuration",
    SAVING: "Saving Parameters...",
    RESET: "Reset to Institutional Defaults",
  },
} as const;
