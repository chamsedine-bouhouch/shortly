import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IShortUrlRepository } from './short-url.repository';
import { ShortUrl, ShortUrlDocument } from '../schemas/short-url.schema';

@Injectable()
export class MongoShortUrlRepository implements IShortUrlRepository {
  constructor(
    @InjectModel(ShortUrl.name)
    private readonly shortUrlModel: Model<ShortUrlDocument>,
  ) {}

  async createShortUrl(
    originalUrl: string,
    shortCode: string,
  ): Promise<string> {
    const newShortUrl = new this.shortUrlModel({ originalUrl, shortCode });
    await newShortUrl.save();
    return shortCode;
  }

  async findByShortCode(shortCode: string): Promise<string | null> {
    const entry = await this.shortUrlModel.findOne({ shortCode }).exec();
    return entry ? entry.originalUrl : null;
  }

  async findAll(): Promise<{ shortCode: string; originalUrl: string }[]> {
    return this.shortUrlModel.find().select('shortCode originalUrl').exec();
  }

  async removeByShortCode(shortCode: string): Promise<void> {
    const result = await this.shortUrlModel.deleteOne({ shortCode }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Short code "${shortCode}" not found`);
    }
  }
}
