import { Module } from "@nestjs/common";
import { ScreenerController } from "./screener.controller";
import { ScreenerService } from "./screener.service";

/**
 * Module responsible for quantitative stock screening and anomaly scans.
 */
@Module({
  controllers: [ScreenerController],
  providers: [ScreenerService],
  exports: [ScreenerService],
})
export class ScreenerModule {}
