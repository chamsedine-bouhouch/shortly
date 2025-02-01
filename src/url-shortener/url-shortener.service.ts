import { Injectable } from '@nestjs/common';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { hashUrlToBase62 } from 'src/utils/base64.util';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectRepository(ShortUrl)
    private shortUrlRepo: Repository<ShortUrl>,
  ) {}
  async create(originalUrl: string, minLength = 6): Promise<string> {
    console.log(originalUrl, 'or');

    // Check if already exists in DB
    const existingEntry = await this.shortUrlRepo.findOne({
      where: { originalUrl },
    });
    if (existingEntry) return existingEntry.shortCode;

    const shortCode = hashUrlToBase62(originalUrl, minLength);

    // Save new entry
    const newShortUrl = this.shortUrlRepo.create({ shortCode, originalUrl });
    await this.shortUrlRepo.save(newShortUrl);

    return shortCode;
  }

  findAll() {
    return `This action returns all urlShortener`;
  }

  findOne(id: number) {
    return `This action returns a #${id} urlShortener`;
  }

  update(id: number, updateUrlShortenerDto: UpdateUrlShortenerDto) {
    return `This action updates a #${id} urlShortener`;
  }

  remove(id: number) {
    return `This action removes a #${id} urlShortener`;
  }
}
