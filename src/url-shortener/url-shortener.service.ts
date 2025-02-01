import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { hashUrlToBase62 } from '../utils/base62.util';

@Injectable()
export class UrlShortenerService {
  private readonly logger = new Logger(UrlShortenerService.name);

  constructor(
    @InjectRepository(ShortUrl)
    private readonly shortUrlRepo: Repository<ShortUrl>,
  ) {}

  async create(originalUrl: string, minLength = 6): Promise<string> {
    this.logger.debug(`Shortening URL: ${originalUrl}`);

    // Check if the URL already has a short code
    const existingEntry = await this.shortUrlRepo.findOne({
      where: { originalUrl },
    });
    if (existingEntry) {
      this.logger.debug(
        `Found existing short code: ${existingEntry.shortCode}`,
      );
      return existingEntry.shortCode;
    }

    // Generate a short code
    const shortCode = hashUrlToBase62(originalUrl, minLength);
    this.logger.debug(`Generated short code: ${shortCode}`);

    // Save to DB
    const newShortUrl = this.shortUrlRepo.create({ shortCode, originalUrl });
    await this.shortUrlRepo.save(newShortUrl);

    return shortCode;
  }

  async findByShortCode(shortCode: string): Promise<string | null> {
    if (!shortCode) throw new Error('Short code cannot be empty');

    const entry = await this.shortUrlRepo.findOne({ where: { shortCode } });
    return entry ? entry.originalUrl : null;
  }

  async findAll(): Promise<ShortUrl[]> {
    return this.shortUrlRepo.find();
  }

  async removeByShortCode(shortCode: string): Promise<boolean> {
    const result = await this.shortUrlRepo.delete({ shortCode });

    if (result.affected === 0) {
      this.logger.warn(`No URL found with short code: ${shortCode}`);
      return false; // Indicate failure if no record was deleted
    }

    this.logger.log(`Deleted URL with short code: ${shortCode}`);
    return true; // Indicate success
  }
}
