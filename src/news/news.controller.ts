import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { NewsService } from './news.service';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("TinTuc")
@Controller('api/news/')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  // ============================================
  //            GET ALL NEWS
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("/")
  getAllNews(@Res() res: Response) {
    return this.newsService.getAllNews(res)
  }


  // ============================================
  //          GET PANIGATION LIST NEWS
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  // @Get("get-pagination-banner/:pageIndex/:pageSize")
  @Get("pagination")
  getPanigationNews(
    @Query("page") pageIndex: number,
    @Query("limit") pageSize: number,
    @Res() res: Response
  ) {
    return this.newsService.getPanigationNews(pageIndex, pageSize, res)
  }

  // ============================================
  //              GET NEWS BY ID
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("/:id")
  getNewsById(@Param("id") id: number, @Res() res: Response) {
    return this.newsService.getNewsById(id, res)
  }

  // // ============================================
  // //           POST UPLOAD IMG NEWS
  // // ============================================
  // @ApiConsumes('multipart/form-data')
  // @HttpCode(201)
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(Role.ADMIN)
  // @Post("/")
  // @UseInterceptors(FileInterceptor("hinh_anh"))

  // postImgNews(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body: FileUploadDto_banner,
  //   @Res() res: Response) {

  //   return this.newsService.postImgNews(file, body, res)
  // }

  // // ============================================
  // //           PUT UPLOAD IMG NEWS
  // // ============================================
  // @ApiConsumes('multipart/form-data')
  // @HttpCode(200)
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(Role.ADMIN)
  // @Put("/:id")
  // @UseInterceptors(FileInterceptor("hinh_anh"))

  // putImgNews(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param("id") id: number,
  //   @Body() body: FileUploadDto_banner,
  //   @Res() res: Response) {

  //   return this.newsService.putImgNews(file, id, body, res)
  // }

  // // ============================================
  // //                DELETE IMG NEWS
  // // ============================================
  // @HttpCode(200)
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(Role.ADMIN)
  // @Delete("/:id")
  // deleteNews(@Param("id") id: number, @Res() res: Response) {
  //   return this.newsService.deleteNews(id, res)
  // }
}
