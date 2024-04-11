import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from './product-type.controller';

@Module({
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
})
export class ProductTypeModule { }
