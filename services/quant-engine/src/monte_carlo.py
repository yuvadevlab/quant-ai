"""
Vectorized Monte Carlo price simulation engine."""

from typing import List, TypedDict
import numpy as np


class TrajectoryBound(TypedDict):
    step: int
    mean: float
    upper_95: float
    lower_95: float
    upper_68: float
    lower_68: float


def simulate_trajectories(
    initial_price: float,
    drift: float,
    volatility: float,
    steps: int = 30,
    paths: int = 5000,
) -> List[TrajectoryBound]:
    """
    Simulates Geometric Brownian Motion price trajectories using NumPy vectorization.

    Args:
        initial_price: Starting asset price (S0)
        drift: Expected annual return drift (mu)
        volatility: Annualized standard deviation (sigma)
        steps: Number of forecast time intervals (dt)
        paths: Number of Monte Carlo iterations

    Returns:
        List of TrajectoryBound points containing quantile confidence bands.
    """
    dt = 1.0 / (steps * 252)
    # Generate standard normal random increments
    random_shocks = np.random.standard_normal((steps, paths))
    
    # Vectorized geometric brownian motion calculation
    drift_term = (drift - 0.5 * volatility**2) * dt
    diffusion_term = volatility * np.sqrt(dt) * random_shocks
    
    log_returns = drift_term + diffusion_term
    cumulative_returns = np.vstack([np.zeros(paths), np.cumsum(log_returns, axis=0)])
    price_paths = initial_price * np.exp(cumulative_returns)

    results: List[TrajectoryBound] = []
    for step_idx in range(steps + 1):
        step_prices = price_paths[step_idx]
        results.append(
            TrajectoryBound(
                step=step_idx,
                mean=float(np.mean(step_prices)),
                upper_95=float(np.percentile(step_prices, 97.5)),
                lower_95=float(np.percentile(step_prices, 2.5)),
                upper_68=float(np.percentile(step_prices, 84.0)),
                lower_68=float(np.percentile(step_prices, 16.0)),
            )
        )

    return results
