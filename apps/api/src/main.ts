/**
 * @fileoverview Application bootstrap entry point for QuantAI API Gateway.
 * @author yuva.devlab@gmail.com
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  ApiSegment,
  DefaultConnectionUrl,
  ServiceIdentity,
  SwaggerTag,
  WsNamespace,
} from "@quant-ai/contracts";
import { AppModule } from "./app.module";
import { ConfigService } from "./modules/infrastructure/config.service";

/**
 * Bootstraps the NestJS API application server.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
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
  console.log(
    `[${ServiceIdentity.TITLE}] REST Gateway: http://localhost:${configService.port}/${ApiSegment.API}`,
  );
  console.log(
    `[${ServiceIdentity.TITLE}] Realtime WebSocket: ws://localhost:${configService.port}${WsNamespace.REALTIME}`,
  );
  console.log(
    `[${ServiceIdentity.TITLE}] Swagger API Docs: http://localhost:${configService.port}/${ApiSegment.DOCS}`,
  );
}

void bootstrap();
