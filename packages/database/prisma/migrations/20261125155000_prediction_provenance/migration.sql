ALTER TABLE "predictions"
ADD COLUMN "strategy" TEXT NOT NULL DEFAULT 'SWING',
ADD COLUMN "asset_class" TEXT NOT NULL DEFAULT 'EQUITY',
ADD COLUMN "data_source" TEXT,
ADD COLUMN "data_status" TEXT NOT NULL DEFAULT 'UNAVAILABLE',
ADD COLUMN "observed_at" TIMESTAMP(3),
ADD COLUMN "metric_eligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "outcome_price" DOUBLE PRECISION,
ADD COLUMN "outcome_at" TIMESTAMP(3);

CREATE INDEX "predictions_metric_eligible_status_idx"
ON "predictions"("metric_eligible", "status");

CREATE TABLE "research_runs" (
  "id" TEXT NOT NULL,
  "ticker" TEXT NOT NULL,
  "service_mode" TEXT NOT NULL,
  "time_horizon" TEXT NOT NULL,
  "result" TEXT NOT NULL DEFAULT 'NO_SETUP',
  "data_source" TEXT,
  "data_status" TEXT NOT NULL DEFAULT 'UNAVAILABLE',
  "observed_at" TIMESTAMP(3),
  "reference_price" DOUBLE PRECISION,
  "snapshot" JSONB NOT NULL DEFAULT '{}',
  "prediction_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "research_runs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "research_runs_prediction_id_fkey"
    FOREIGN KEY ("prediction_id") REFERENCES "predictions"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "research_runs_ticker_service_mode_time_horizon_created_at_idx"
ON "research_runs"("ticker", "service_mode", "time_horizon", "created_at" DESC);
CREATE INDEX "research_runs_result_created_at_idx"
ON "research_runs"("result", "created_at" DESC);
