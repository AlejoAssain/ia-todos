import { Injectable } from '@nestjs/common';

import { IaService } from './ia/ia.service';

@Injectable()
export class AppService {
  constructor(private readonly iaService: IaService) {}

  async getHello(): Promise<string> {
    return this.iaService.generateHelloMessage();
  }
}
