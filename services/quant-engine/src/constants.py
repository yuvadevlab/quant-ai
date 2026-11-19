"""
QuantAI Quantitative Engine — Global Constants & Model Defaults.
Author: yuva.devlab@gmail.com
"""

from enum import Enum


class SimulationModel(str, Enum):
    """Supported stochastic price simulation models."""

    GBM = "gbm"
    GARCH = "garch"


# Annual trading days convention for equity markets (NSE / NYSE)
ANNUAL_TRADING_DAYS: int = 252

# Default Monte Carlo parameters
DEFAULT_STEPS: int = 30
DEFAULT_PATHS: int = 5000
DEFAULT_DRIFT: float = 0.05
DEFAULT_VOLATILITY: float = 0.22

# Standard GARCH(1,1) calibrated parameters for equity indices / large caps
# sigma_t^2 = omega + alpha * epsilon_{t-1}^2 + beta * sigma_{t-1}^2
# Persistence = alpha + beta < 1.0 (mean-reverting volatility)
DEFAULT_GARCH_ALPHA: float = 0.10  # Weight on recent shock squared
DEFAULT_GARCH_BETA: float = 0.85  # Persistence of previous variance
DEFAULT_GARCH_OMEGA: float = 0.000005  # Long-run baseline variance scaled to daily dt
