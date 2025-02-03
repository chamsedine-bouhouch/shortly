import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IShortUrlRepository } from './short-url.repository';
import { MongoShortUrlRepository } from './mongo-short-url.repository';
import { TypeOrmShortUrlRepository } from './typeorm-short-url.repository';

@Injectable()
export class ShortUrlRepositoryFactory {
  constructor(
    private readonly configService: ConfigService,
    @Inject(MongoShortUrlRepository)
    private readonly mongoRepo: MongoShortUrlRepository,
    @Inject(TypeOrmShortUrlRepository)
    private readonly typeOrmRepo: TypeOrmShortUrlRepository,
  ) {}

  getRepository(): IShortUrlRepository {
    const dbType = this.configService.get<string>('DB_TYPE');
    return dbType === 'mongodb' ? this.mongoRepo : this.typeOrmRepo;
  }
}
