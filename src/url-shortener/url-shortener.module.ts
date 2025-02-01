import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from './entities/short-url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrl])],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
