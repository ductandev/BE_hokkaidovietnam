import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { JwtStrategy } from './strategy/jwt.strategy';
import { CommentModule } from './comment/comment.module';

import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BannerModule } from './banner/banner.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { NewsModule } from './news/news.module';
import { ContactModule } from './contact/contact.module';
import { CartModule } from './cart/cart.module';


@Module({
  imports: [
    CloudinaryModule,                           // CloudinaryModule
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CommentModule,
    ProductModule,
    ProductTypeModule,
    OrderModule,
    OrderDetailModule,
    BannerModule,
    NewsModule,
    ContactModule,
    CartModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
