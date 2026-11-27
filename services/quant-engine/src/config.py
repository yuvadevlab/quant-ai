"""
QuantAI Quantitative Engine — Environment & Infrastructure Configuration.
"""

import os
from pathlib import Path
from pydantic import BaseModel, Field

DEFAULT_QUANT_ENGINE_PORT = 8005
DEFAULT_QUANT_ENGINE_HOST = "0.0.0.0"


def _load_workspace_env() -> None:
    """Loads variables from workspace root `.env` without overriding process env."""
    env_path = Path(__file__).resolve().parents[3] / ".env"
    if not env_path.is_file():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_workspace_env()


class Settings(BaseModel):
    """Application infrastructure runtime configuration."""

    environment: str = Field(
        default_factory=lambda: os.getenv("ENVIRONMENT")
        or os.getenv("NODE_ENV", "development")
    )
    host: str = Field(
        default_factory=lambda: os.getenv("QUANT_ENGINE_HOST")
        or os.getenv("HOST", DEFAULT_QUANT_ENGINE_HOST)
    )
    port: int = Field(
        default_factory=lambda: int(
            os.getenv("QUANT_ENGINE_PORT")
            or os.getenv("PORT", str(DEFAULT_QUANT_ENGINE_PORT))
        )
    )
    postgres_url: str = Field(
        default_factory=lambda: os.getenv(
            "POSTGRES_URL",
            "postgresql://quantai:quantai_secret@localhost:5432/quantai_db",
        )
    )
    redis_url: str = Field(
        default_factory=lambda: os.getenv("REDIS_URL", "redis://localhost:6379")
    )
    kafka_brokers: str = Field(
        default_factory=lambda: os.getenv("KAFKA_BROKERS", "localhost:19092")
    )


settings = Settings()
