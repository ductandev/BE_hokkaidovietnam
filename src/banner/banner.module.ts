import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
