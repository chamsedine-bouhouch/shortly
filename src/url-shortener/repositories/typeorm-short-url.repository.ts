import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IShortUrlRepository } from './short-url.repository';
import { ShortUrl as ShortUrlEntity } from '../entities/short-url.entity';

@Injectable()
export class TypeOrmShortUrlRepository implements IShortUrlRepository {
  constructor(
    @InjectRepository(ShortUrlEntity)
    private readonly shortUrlRepository: Repository<ShortUrlEntity>,
  ) {}

  async createShortUrl(
    originalUrl: string,
    shortCode: string,
  ): Promise<string> {
    const newShortUrl = this.shortUrlRepository.create({
      originalUrl,
      shortCode,
    });
    await this.shortUrlRepository.save(newShortUrl);
    return shortCode;
  }

  async findByShortCode(shortCode: string): Promise<string | null> {
    const entry = await this.shortUrlRepository.findOne({
      where: { shortCode },
    });
    return entry ? entry.originalUrl : null;
  }

  async findAll(): Promise<{ shortCode: string; originalUrl: string }[]> {
    return this.shortUrlRepository.find({
      select: ['id', 'shortCode', 'originalUrl', 'createdAt'],
      order: { createdAt: 'DESC' }, // Sort by createdAt descending
    });
  }

  async removeByShortCode(shortCode: string): Promise<void> {
    const result = await this.shortUrlRepository.delete({ shortCode });
    if (result.affected === 0) {
      throw new NotFoundException(`Short code "${shortCode}" not found`);
    }
  }
}
