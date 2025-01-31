import { Injectable } from '@nestjs/common';
import { hashUrlToBase62 } from './utils/base64.util';

@Injectable()
export class AppService {
  getHello(): string {
    return hashUrlToBase62('https://www.canva.com/your-apps');
  }
}
