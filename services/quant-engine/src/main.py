"""
QuantAI Quantitative Engine — FastAPI Service."""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from src.monte_carlo import simulate_trajectories, TrajectoryBound

app = FastAPI(
    title="QuantAI Quantitative Engine",
    description="Vectorized numerical simulation and quantitative analysis service",
    version="0.1.0",
)


class MonteCarloRequest(BaseModel):
    initial_price: float = Field(..., gt=0, description="Current market price")
    drift: float = Field(0.05, description="Expected annualized drift")
    volatility: float = Field(..., gt=0, description="Annualized historical or implied volatility")
    steps: int = Field(30, ge=5, le=200, description="Projection steps")
    paths: int = Field(5000, ge=1000, le=50000, description="Monte Carlo simulation iterations")


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health and readiness probe."""
    return HealthResponse(
        status="healthy",
        service="quant-engine",
        version="0.1.0",
    )


@app.post("/api/v1/monte-carlo", response_model=List[TrajectoryBound])
async def run_monte_carlo(payload: MonteCarloRequest):
    """Generates vectorized Monte Carlo trajectory quantile bands."""
    try:
        return simulate_trajectories(
            initial_price=payload.initial_price,
            drift=payload.drift,
            volatility=payload.volatility,
            steps=payload.steps,
            paths=payload.paths,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
