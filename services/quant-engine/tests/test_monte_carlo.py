"""
Unit tests for vectorized Monte Carlo simulation with GBM and GARCH(1,1).
Author: yuva.devlab@gmail.com
"""

import numpy as np

from src.constants import SimulationModel
from src.monte_carlo import simulate_garch, simulate_gbm, simulate_trajectories


def test_simulate_gbm_shape_and_initial_price():
    initial_price = 100.0
    steps = 10
    paths = 1000
    price_paths = simulate_gbm(
        initial_price=initial_price,
        drift=0.05,
        volatility=0.2,
        steps=steps,
        paths=paths,
    )
    assert price_paths.shape == (steps + 1, paths)
    assert np.allclose(price_paths[0], initial_price)
    assert np.all(price_paths > 0)


def test_simulate_garch_shape_and_initial_price():
    initial_price = 2500.0
    steps = 15
    paths = 1000
    price_paths = simulate_garch(
        initial_price=initial_price,
        drift=0.08,
        volatility=0.25,
        steps=steps,
        paths=paths,
    )
    assert price_paths.shape == (steps + 1, paths)
    assert np.allclose(price_paths[0], initial_price)
    assert np.all(price_paths > 0)


def test_simulate_trajectories_quantile_monotonicity():
    bounds = simulate_trajectories(
        initial_price=3000.0,
        drift=0.05,
        volatility=0.22,
        steps=20,
        paths=2000,
        model=SimulationModel.GARCH,
    )
    assert len(bounds) == 21
    for b in bounds:
        # Check quantile ordering: lower_95 <= lower_68 <= mean <= upper_68 <= upper_95
        assert b["lower_95"] <= b["lower_68"]
        assert b["lower_68"] <= b["mean"]
        assert b["mean"] <= b["upper_68"]
        assert b["upper_68"] <= b["upper_95"]


def test_simulate_trajectories_gbm_fallback():
    bounds = simulate_trajectories(
        initial_price=500.0,
        drift=0.02,
        volatility=0.15,
        steps=5,
        paths=1000,
        model=SimulationModel.GBM,
    )
    assert len(bounds) == 6
    assert bounds[0]["mean"] == 500.0
