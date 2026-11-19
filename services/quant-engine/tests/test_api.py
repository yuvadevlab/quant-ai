"""
Integration tests for QuantAI FastAPI quantitative engine endpoints.
Author: yuva.devlab@gmail.com
"""

from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "quant-engine"


def test_monte_carlo_endpoint_valid():
    payload = {
        "initial_price": 2985.0,
        "drift": 0.05,
        "volatility": 0.22,
        "steps": 10,
        "paths": 1000,
        "model": "garch",
    }
    response = client.post("/api/v1/monte-carlo", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 11
    assert data[0]["step"] == 0
    assert data[0]["mean"] == 2985.0


def test_monte_carlo_endpoint_invalid_persistence():
    payload = {
        "initial_price": 100.0,
        "alpha": 0.6,
        "beta": 0.5,  # 0.6 + 0.5 = 1.1 >= 1.0 (invalid non-stationary persistence)
        "steps": 10,
        "paths": 500,
    }
    response = client.post("/api/v1/monte-carlo", json=payload)
    assert response.status_code == 422
