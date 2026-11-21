/**
 * @file apps/api/src/modules/chat/chat.controller.ts
 * @description Controller handling AI Copilot message queries.
 * @author yuva.devlab@gmail.com
 */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
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
    const text = dto.message?.trim() ?? "";
    this.logger.info(`[sendMessage] Received chat query payload (length: ${text.length})`);
    return this.chatService.handleUserMessage(text, dto.sessionId, dto.providerOverride);
  }
}
