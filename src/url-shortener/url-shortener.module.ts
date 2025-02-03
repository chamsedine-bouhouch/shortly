import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { ShortUrlSchema } from './schemas/short-url.schema';
import { ShortUrl } from './entities/short-url.entity';
import { MongoShortUrlRepository } from './repositories/mongo-short-url.repository';
import { TypeOrmShortUrlRepository } from './repositories/typeorm-short-url.repository';
import { ShortUrlRepositoryFactory } from './repositories/short-url-repository.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortUrl]), // PostgreSQL
    MongooseModule.forFeature([{ name: 'ShortUrl', schema: ShortUrlSchema }]), // MongoDB
  ],
  controllers: [UrlShortenerController],
  providers: [
    UrlShortenerService,
    MongoShortUrlRepository,
    TypeOrmShortUrlRepository,
    ShortUrlRepositoryFactory,
  ],
})
export class UrlShortenerModule {}
