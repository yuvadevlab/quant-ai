/**
 * @file apps/api/src/modules/chat/chat.controller.ts
 * @description Controller handling AI Copilot message queries.
 * @author yuva.devlab@gmail.com
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AiProviderType } from "@quant-ai/shared-types";
import { ChatService, type ChatMessageResponse } from "./chat.service";

interface SendChatMessageDto {
  readonly message: string;
  readonly providerOverride?: AiProviderType;
}

/**
 * Controller exposing AI Copilot endpoints.
 */
@Controller("chat")
export class ChatController {
  public constructor(private readonly chatService: ChatService) {}

  /**
   * Processes a trader's message query with real-time quantitative synthesis.
   */
  @Post("message")
  @HttpCode(HttpStatus.OK)
  public async sendMessage(@Body() dto: SendChatMessageDto): Promise<ChatMessageResponse> {
    const text = dto.message?.trim() ?? "";
    return this.chatService.handleUserMessage(text, dto.providerOverride);
  }
}
