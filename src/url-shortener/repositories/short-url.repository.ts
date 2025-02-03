export interface IShortUrlRepository {
  createShortUrl(originalUrl: string, shortCode: string): Promise<string>;
  findByShortCode(shortCode: string): Promise<string | null>;
  findAll(): Promise<{ shortCode: string; originalUrl: string }[]>;
  removeByShortCode(shortCode: string): Promise<void>;
}
