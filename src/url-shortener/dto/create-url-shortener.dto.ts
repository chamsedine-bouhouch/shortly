import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlShortenerDto {
  @IsString()
  @IsNotEmpty()
  originalUrl: string;
}
