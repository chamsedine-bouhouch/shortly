import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}
  private readonly logger = new Logger(UrlShortenerService.name);

  @Post()
  async create(
    @Body() createUrlShortenerDto: CreateUrlShortenerDto,
  ): Promise<{ shortCode: string }> {
    try {
      const shortCode = await this.urlShortenerService.create(
        createUrlShortenerDto.originalUrl,
      );
      return { shortCode };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException
      } else if (error instanceof InternalServerErrorException) {
        throw error; // Re-throw InternalServerErrorException
      }
      // All other errors: Log and return generic 500
      this.logger.error(
        `Error creating short URL: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create short URL');
    }
  }

  @Get()
  async findAll() {
    return this.urlShortenerService.findAll();
  }

  @Get(':shortCode')
  async findOne(
    @Param('shortCode') shortCode: string,
  ): Promise<{ originalUrl: string }> {
    const originalUrl =
      await this.urlShortenerService.findByShortCode(shortCode);
    if (!originalUrl) {
      throw new NotFoundException(
        `Short URL with code "${shortCode}" not found.`,
      );
    }
    return { originalUrl };
  }

  @Delete(':shortCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('shortCode') shortCode: string): Promise<void> {
    const deleted = await this.urlShortenerService.removeByShortCode(shortCode);
    if (!deleted) {
      throw new NotFoundException(
        `Short URL with code "${shortCode}" not found.`,
      );
    }
  }
}
