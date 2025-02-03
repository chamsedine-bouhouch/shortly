import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShortUrlDocument = ShortUrl & Document;

@Schema({ timestamps: true })
export class ShortUrl {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ unique: true, required: true })
  shortCode: string;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
