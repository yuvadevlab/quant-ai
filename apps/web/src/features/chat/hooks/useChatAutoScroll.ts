/**
 * @file src/features/chat/hooks/useChatAutoScroll.ts
 * @description ResizeObserver-driven chat auto-scroll hook that follows streamed tokens without fighting user scroll.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { isNearBottom } from "../utils/scrollPolicy";

/**
 * Chat auto-scroll policy hook (ChatGPT / Claude / FinAI behavior).
 * Uses ResizeObserver on the inner content wrapper so streamed tokens and markdown
 * re-layouts pin smoothly without smooth-scroll animation jitter.
 */
export function useChatAutoScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const autoScrollRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const followBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el || !autoScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const scrollToBottom = useCallback(() => {
    autoScrollRef.current = true;
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    setIsAtBottom(true);
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const near = isNearBottom(el.scrollHeight, el.scrollTop, el.clientHeight);
    autoScrollRef.current = near;
    setIsAtBottom(near);
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => followBottom());
    observer.observe(content);
    observer.observe(container);
    return () => observer.disconnect();
  }, [followBottom]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return {
    containerRef,
    contentRef,
    isAtBottom,
    handleScroll,
    followBottom,
    scrollToBottom,
  };
}
