import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

/**
 * Bootstraps the NestJS API application server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for client workstation
  app.enableCors({
    origin: ["http://localhost:3005", "http://127.0.0.1:3005"],
    credentials: true,
  });

  // Global API routing prefix
  app.setGlobalPrefix("api");

  // OpenAPI Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("QuantAI API")
    .setDescription("Enterprise Quantitative Market Intelligence Gateway")
    .setVersion("1.0.0")
    .addTag("Market")
    .addTag("Predictions")
    .addTag("Health")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 4005;
  await app.listen(port);
  console.log(`[QuantAI API] Running on http://localhost:${port}/api`);
  console.log(`[QuantAI API] Swagger Docs on http://localhost:${port}/docs`);
}

bootstrap();
