import { Injectable, Logger } from '@nestjs/common';
import { ShortUrlRepositoryFactory } from './repositories/short-url-repository.factory';
import { IShortUrlRepository } from './repositories/short-url.repository';
import { hashUrlToBase62 } from 'src/utils/base62.util';

@Injectable()
export class UrlShortenerService {
  private readonly logger = new Logger(UrlShortenerService.name);
  private repository: IShortUrlRepository;

  constructor(private readonly repositoryFactory: ShortUrlRepositoryFactory) {
    this.repository = this.repositoryFactory.getRepository();
  }

  async create(originalUrl: string, minLength = 6): Promise<string> {
    this.logger.debug(`Shortening URL: ${originalUrl}`);

    // Check if the URL already has a short code
    const existingEntry = await this.repository.findByShortCode(originalUrl);
    if (existingEntry) {
      this.logger.debug(`Found existing short code: ${existingEntry}`);
      return existingEntry;
    }

    // Generate a short code
    const shortCode = hashUrlToBase62(originalUrl, minLength);
    this.logger.debug(`Generated short code: ${shortCode}`);

    // Save to DB
    return await this.repository.createShortUrl(originalUrl, shortCode);
  }

  async findByShortCode(shortCode: string): Promise<string | null> {
    return this.repository.findByShortCode(shortCode);
  }

  async findAll(): Promise<{ shortCode: string; originalUrl: string }[]> {
    return this.repository.findAll();
  }

  async removeByShortCode(shortCode: string): Promise<void> {
    return this.repository.removeByShortCode(shortCode);
  }
}
