import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFile, Query, Patch } from '@nestjs/common';
import { NewsService } from './news.service';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

import { CreateNewsDto } from './dto/create-news.dto';


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
  @Get("pagination")
  getPanigationNews(
    @Query("page") pageIndex: number,
    @Query("limit") pageSize: number,
    @Query('search') search: string,
    @Res() res: Response
  ) {
    return this.newsService.getPanigationNews(
      pageIndex,
      pageSize,
      search,
      res
    );
  }

  // ============================================
  //            GET ALL NEWS SUMARY
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN)
  @Get("summary")
  getNewsSummary(@Res() res: Response) {
    return this.newsService.getNewsSummary(res)
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

  // ============================================
  //           GET NEWS BY NAME
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('name/:name')
  getNameNews(
    @Query('name') name: string,
    @Res() res: Response,
  ) {
    return this.newsService.getNameNews(name, res);
  }



  // ============================================
  //           POST UPLOAD NEWS
  // ============================================
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Post("/")

  postNews(
    @Body() body: CreateNewsDto,
    @Res() res: Response) {

    return this.newsService.postNews(body, res)
  }

  // ============================================
  //           PATCH UPLOAD NEWS
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Patch("/:id")

  patchNews(
    @Param("id") id: number,
    @Body() body: CreateNewsDto,
    @Res() res: Response) {

    return this.newsService.patchNews(id, body, res)
  }

  // ============================================
  //           POST UPLOAD NEWS FORM DATA
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Post("/create")
  @UseInterceptors(FileInterceptor("hinh_anh"))

  postNewsFormData(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNewsDto,
    @Res() res: Response) {

    return this.newsService.postNewsFormData(file, body, res)
  }

  // ============================================
  //           PUT UPLOAD NEWS FORM DATA
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Put("create/:id")
  @UseInterceptors(FileInterceptor("hinh_anh"))

  putNewsFormData(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: number,
    @Body() body: CreateNewsDto,
    @Res() res: Response) {

    return this.newsService.putNewsFormData(file, id, body, res)
  }

  // ============================================
  //                DELETE NEWS
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteNews(@Param("id") id: number, @Res() res: Response) {
    return this.newsService.deleteNews(id, res)
  }
}
