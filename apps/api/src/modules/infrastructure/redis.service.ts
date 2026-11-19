/**
 * @fileoverview High-performance cache and low-latency state service with resilient in-memory fallback.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "./config.service";

interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt?: number;
}

/**
 * Low-latency key-value cache service for order book, tickers, and token states.
 */
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly memoryStore = new Map<string, CacheEntry<unknown>>();

  public constructor(private readonly configService: ConfigService) {
    this.logger.log(`Cache service initialized (URL: ${this.configService.redisUrl})`);
  }

  /**
   * Retrieves an item from cache.
   *
   * @param key Unique key
   * @returns Value or null if expired/absent
   */
  public async get<T>(key: string): Promise<T | null> {
    const entry = this.memoryStore.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Stores an item with optional time-to-live in seconds.
   *
   * @param key Unique key
   * @param value Value to store
   * @param ttlSeconds Optional TTL in seconds
   */
  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.memoryStore.set(key, { value, expiresAt });
  }

  /**
   * Deletes an item from the cache.
   *
   * @param key Cache key
   */
  public async delete(key: string): Promise<void> {
    this.memoryStore.delete(key);
  }

  /**
   * Checks whether a key exists in cache.
   *
   * @param key Cache key
   */
  public async has(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== null;
  }
}
