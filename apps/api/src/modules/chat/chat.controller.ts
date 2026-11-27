/**
 * @file apps/api/src/modules/chat/chat.controller.ts
 * @description Controller handling AI Copilot message queries.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { Logger } from "@yuva-devlab/logger";
import { AgentStreamEventType } from "@quant-ai/shared-types";
import { ChatService } from "./chat.service";
import type {
  ChatMessageResponse,
  ChatSessionDetail,
  ChatSessionSummary,
  SendChatMessageDto,
} from "./chat.types";

/**
 * Controller exposing AI Copilot endpoints.
 */
@Controller("chat")
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  public constructor(private readonly chatService: ChatService) {}

  /**
   * Retrieves summary list of all conversation sessions.
   */
  @Get("sessions")
  public async getSessions(): Promise<ChatSessionSummary[]> {
    return this.chatService.getSessions();
  }

  /**
   * Retrieves full conversation thread detail.
   */
  @Get("sessions/:id")
  public async getSession(@Param("id") id: string): Promise<ChatSessionDetail | null> {
    return this.chatService.getSession(id);
  }

  /**
   * Deletes a conversation session by identifier.
   */
  @Delete("sessions/:id")
  public async deleteSession(@Param("id") id: string): Promise<{ success: boolean }> {
    await this.chatService.deleteSession(id);
    return { success: true };
  }

  /**
   * Processes a trader's message query with real-time quantitative synthesis.
   */
  @Post("message")
  @HttpCode(HttpStatus.OK)
  public async sendMessage(@Body() dto: SendChatMessageDto): Promise<ChatMessageResponse> {
    const text = (dto.message ?? dto.query)?.trim() ?? "";
    this.logger.info(`[sendMessage] Received chat query payload (length: ${text.length})`);
    return this.chatService.handleUserMessage(text, dto.sessionId, dto.providerOverride);
  }

  /**
   * Streams real-time execution logs, reasoning, tool calls, and tokens via Server-Sent Events.
   */
  @Post("chat")
  @HttpCode(HttpStatus.OK)
  public async streamChat(@Body() dto: SendChatMessageDto, @Res() res: Response): Promise<void> {
    return this.handleSseStream(dto, res);
  }

  /**
   * Alias SSE endpoint for `/api/chat/stream`.
   */
  @Post("stream")
  @HttpCode(HttpStatus.OK)
  public async streamMessage(@Body() dto: SendChatMessageDto, @Res() res: Response): Promise<void> {
    return this.handleSseStream(dto, res);
  }

  private async handleSseStream(dto: SendChatMessageDto, res: Response): Promise<void> {
    const text = (dto.message ?? dto.query)?.trim() ?? "";
    this.logger.info(`[handleSseStream] Starting SSE stream (length: ${text.length})`);

    // Explicitly set 200 OK before flushHeaders() so Cloud Run / GFE does not buffer the stream.
    res.status(HttpStatus.OK);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const abortController = new AbortController();
    res.on("close", () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    });

    const emit = (payload: unknown): void => {
      if (res.writableEnded || abortController.signal.aborted) return;
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      (res as { flush?: () => void }).flush?.();
    };

    try {
      const response = await this.chatService.handleUserMessage(
        text,
        dto.sessionId,
        dto.providerOverride,
        emit,
        abortController.signal,
      );
      emit({
        type: AgentStreamEventType.COMPLETE,
        payload: response as unknown as Record<string, unknown>,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Streaming execution failed";
      this.logger.error(`[handleSseStream] Stream failed: ${message}`);
      emit({ type: AgentStreamEventType.ERROR, error: message });
    } finally {
      emit({ type: AgentStreamEventType.DONE });
      if (!res.writableEnded) {
        res.end();
      }
    }
  }
}
