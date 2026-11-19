"""
QuantAI Quantitative Engine — Environment & Infrastructure Configuration.
Author: yuva.devlab@gmail.com
"""

import os
from pydantic import BaseModel, Field


class Settings(BaseModel):
    """Application infrastructure runtime configuration."""

    environment: str = Field(
        default_factory=lambda: os.getenv("ENVIRONMENT", "development")
    )
    port: int = Field(default_factory=lambda: int(os.getenv("PORT", "8000")))
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
