/**
 * @fileoverview Application bootstrap entry point for QuantAI API Gateway.
 */

import "reflect-metadata";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@yuva-devlab/logger";
import {
  ApiSegment,
  DefaultConnectionUrl,
  ServiceIdentity,
  SwaggerTag,
  WsNamespace,
} from "@quant-ai/shared-types";
import { AppModule } from "./app.module";
import { ConfigService } from "./modules/infrastructure/config.service";

/**
 * Bootstraps the NestJS API application server.
 */
async function bootstrap(): Promise<void> {
  // Load workspace or local .env when started directly via `node dist/main.js`
  const envCandidates = [resolve(process.cwd(), ".env"), resolve(__dirname, "../../../.env")];
  for (const envPath of envCandidates) {
    if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
      process.loadEnvFile(envPath);
      break;
    }
  }

  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, { logger });
  const configService = app.get(ConfigService);

  // Enable CORS for client workstation
  app.enableCors({
    origin: [
      configService.corsOrigin,
      DefaultConnectionUrl.CORS_DEV_WEB,
      DefaultConnectionUrl.CORS_DEV_WEB_IP,
    ],
    credentials: true,
  });

  // Global API routing prefix
  app.setGlobalPrefix(ApiSegment.API);

  // OpenAPI Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(ServiceIdentity.TITLE)
    .setDescription(ServiceIdentity.DESCRIPTION)
    .setVersion(ServiceIdentity.VERSION)
    .addTag(SwaggerTag.MARKET)
    .addTag(SwaggerTag.PREDICTIONS)
    .addTag(SwaggerTag.SCREENER)
    .addTag(SwaggerTag.HEALTH)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(ApiSegment.DOCS, app, document);

  await app.listen(configService.port);
  logger.info(
    `[bootstrap] [${ServiceIdentity.TITLE}] REST Gateway: http://localhost:${configService.port}/${ApiSegment.API}`,
  );
  logger.info(
    `[bootstrap] [${ServiceIdentity.TITLE}] Realtime WebSocket: ws://localhost:${configService.port}${WsNamespace.REALTIME}`,
  );
  logger.info(
    `[bootstrap] [${ServiceIdentity.TITLE}] Swagger API Docs: http://localhost:${configService.port}/${ApiSegment.DOCS}`,
  );
}

void bootstrap();
