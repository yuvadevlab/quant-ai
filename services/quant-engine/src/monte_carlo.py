"""
Vectorized Monte Carlo price simulation engine with GBM and GARCH(1,1) volatility clustering.
"""

from typing import TypedDict

import numpy as np

from src.constants import (
    ANNUAL_TRADING_DAYS,
    DEFAULT_DRIFT,
    DEFAULT_GARCH_ALPHA,
    DEFAULT_GARCH_BETA,
    DEFAULT_GARCH_OMEGA,
    DEFAULT_PATHS,
    DEFAULT_STEPS,
    DEFAULT_VOLATILITY,
    SimulationModel,
)


class TrajectoryBound(TypedDict):
    """Percentile quantile boundaries for a given simulation time step."""

    step: int
    mean: float
    upper_95: float
    lower_95: float
    upper_68: float
    lower_68: float


def _extract_bounds(price_paths: np.ndarray, steps: int) -> list[TrajectoryBound]:
    """Computes distribution quantiles from price trajectory paths."""
    results: list[TrajectoryBound] = []
    for step_idx in range(steps + 1):
        step_prices = price_paths[step_idx]
        results.append(
            TrajectoryBound(
                step=step_idx,
                mean=round(float(np.mean(step_prices)), 2),
                upper_95=round(float(np.percentile(step_prices, 97.5)), 2),
                lower_95=round(float(np.percentile(step_prices, 2.5)), 2),
                upper_68=round(float(np.percentile(step_prices, 84.0)), 2),
                lower_68=round(float(np.percentile(step_prices, 16.0)), 2),
            )
        )
    return results


def simulate_gbm(
    initial_price: float,
    drift: float = DEFAULT_DRIFT,
    volatility: float = DEFAULT_VOLATILITY,
    steps: int = DEFAULT_STEPS,
    paths: int = DEFAULT_PATHS,
) -> np.ndarray:
    """Simulates Geometric Brownian Motion trajectories with full 2D vectorization."""
    dt = 1.0 / (steps * ANNUAL_TRADING_DAYS)
    random_shocks = np.random.standard_normal((steps, paths))
    drift_term = (drift - 0.5 * volatility**2) * dt
    diffusion_term = volatility * np.sqrt(dt) * random_shocks
    log_returns = drift_term + diffusion_term
    cumulative_returns = np.vstack([np.zeros(paths), np.cumsum(log_returns, axis=0)])
    return initial_price * np.exp(cumulative_returns)


def simulate_garch(
    initial_price: float,
    drift: float = DEFAULT_DRIFT,
    volatility: float = DEFAULT_VOLATILITY,
    steps: int = DEFAULT_STEPS,
    paths: int = DEFAULT_PATHS,
    omega: float = DEFAULT_GARCH_OMEGA,
    alpha: float = DEFAULT_GARCH_ALPHA,
    beta: float = DEFAULT_GARCH_BETA,
) -> np.ndarray:
    """
    Simulates price paths with GARCH(1,1) volatility clustering.
    Recurrence is vectorized across all paths at each discrete forecast step.
    """
    dt = 1.0 / (steps * ANNUAL_TRADING_DAYS)
    initial_variance = (volatility**2) * dt
    current_variance = np.full(paths, initial_variance)
    price_paths = np.empty((steps + 1, paths), dtype=np.float64)
    price_paths[0] = initial_price

    for t in range(steps):
        # Draw standard normal shocks for all paths
        z_t = np.random.standard_normal(paths)
        std_t = np.sqrt(np.maximum(current_variance, 1e-12))
        shock_t = std_t * z_t

        # Log return with dynamic stochastic volatility
        drift_t = (drift - 0.5 * (std_t**2 / dt)) * dt
        r_t = drift_t + shock_t
        price_paths[t + 1] = price_paths[t] * np.exp(r_t)

        # GARCH(1,1) variance update: sigma_{t+1}^2 = omega + alpha * epsilon_t^2 + beta * sigma_t^2
        current_variance = omega + alpha * (shock_t**2) + beta * current_variance

    return price_paths


def simulate_trajectories(
    initial_price: float,
    drift: float = DEFAULT_DRIFT,
    volatility: float = DEFAULT_VOLATILITY,
    steps: int = DEFAULT_STEPS,
    paths: int = DEFAULT_PATHS,
    model: SimulationModel = SimulationModel.GARCH,
    omega: float = DEFAULT_GARCH_OMEGA,
    alpha: float = DEFAULT_GARCH_ALPHA,
    beta: float = DEFAULT_GARCH_BETA,
) -> list[TrajectoryBound]:
    """
    High-level entry point generating confidence quantile bands for price trajectories.
    Supports either pure Geometric Brownian Motion or GARCH(1,1) volatility clustering.
    """
    if model == SimulationModel.GBM:
        price_paths = simulate_gbm(
            initial_price=initial_price,
            drift=drift,
            volatility=volatility,
            steps=steps,
            paths=paths,
        )
    else:
        price_paths = simulate_garch(
            initial_price=initial_price,
            drift=drift,
            volatility=volatility,
            steps=steps,
            paths=paths,
            omega=omega,
            alpha=alpha,
            beta=beta,
        )

    return _extract_bounds(price_paths, steps)
