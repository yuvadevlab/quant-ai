"""
QuantAI Quantitative Engine — FastAPI Vectorized Simulation Service.
Author: yuva.devlab@gmail.com
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from src.constants import (
    DEFAULT_DRIFT,
    DEFAULT_GARCH_ALPHA,
    DEFAULT_GARCH_BETA,
    DEFAULT_GARCH_OMEGA,
    DEFAULT_PATHS,
    DEFAULT_STEPS,
    DEFAULT_VOLATILITY,
    SimulationModel,
)
from src.config import settings
from src.monte_carlo import TrajectoryBound, simulate_trajectories


app = FastAPI(
    title="QuantAI Quantitative Engine",
    description="Vectorized numerical simulation and quantitative analysis service",
    version="0.2.0",
)


class MonteCarloRequest(BaseModel):
    """Payload for Monte Carlo stochastic simulation."""

    initial_price: float = Field(..., gt=0, description="Current market price (S0)")
    drift: float = Field(DEFAULT_DRIFT, description="Annualized expected drift (mu)")
    volatility: float = Field(
        DEFAULT_VOLATILITY,
        gt=0,
        description="Annualized historical or implied volatility (sigma)",
    )
    steps: int = Field(
        DEFAULT_STEPS, ge=5, le=200, description="Projection forecast steps (dt)"
    )
    paths: int = Field(
        DEFAULT_PATHS,
        ge=500,
        le=50000,
        description="Monte Carlo simulation sample paths",
    )
    model: SimulationModel = Field(
        SimulationModel.GARCH, description="Stochastic process model (gbm or garch)"
    )
    omega: float = Field(
        DEFAULT_GARCH_OMEGA, ge=0, description="GARCH baseline variance parameter"
    )
    alpha: float = Field(
        DEFAULT_GARCH_ALPHA, ge=0, le=1, description="GARCH shock persistence parameter"
    )
    beta: float = Field(
        DEFAULT_GARCH_BETA,
        ge=0,
        le=1,
        description="GARCH historical variance decay parameter",
    )


class HealthResponse(BaseModel):
    """Health check response schema."""

    status: str
    service: str
    version: str
    environment: str


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Readiness and liveness probe."""
    return HealthResponse(
        status="healthy",
        service="quant-engine",
        version="0.2.0",
        environment=settings.environment,
    )



@app.post("/api/v1/monte-carlo", response_model=list[TrajectoryBound])
async def run_monte_carlo(payload: MonteCarloRequest) -> list[TrajectoryBound]:
    """Generates vectorized Monte Carlo trajectory quantile bands with dynamic volatility."""
    if payload.alpha + payload.beta >= 1.0:
        raise HTTPException(
            status_code=422,
            detail="GARCH persistence condition violated: alpha + beta must be strictly less than 1.0",
        )
    try:
        return simulate_trajectories(
            initial_price=payload.initial_price,
            drift=payload.drift,
            volatility=payload.volatility,
            steps=payload.steps,
            paths=payload.paths,
            model=payload.model,
            omega=payload.omega,
            alpha=payload.alpha,
            beta=payload.beta,
        )
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
