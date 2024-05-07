import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { BannerService } from './banner.service';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto_banner } from './dto/upload.dto';


@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("Banner")
@Controller('api/banner/')
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  // ============================================
  //            GET ALL BANNER
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("/")
  getAllBanner(@Res() res: Response) {
    return this.bannerService.getAllBanner(res)
  }

  // ============================================
  //      GET PANIGATION LIST BANNER
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  // @Get("get-pagination-banner/:pageIndex/:pageSize")
  @Get("pagination")
  getPanigationBanner(
    @Query("page") pageIndex: number,
    @Query("limit") pageSize: number,
    @Res() res: Response
  ) {
    return this.bannerService.getPanigationBanner(pageIndex, pageSize, res)
  }

  // ============================================
  //           GET NAME BANNER BY ID
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("/:id")
  getBannerById(@Param("id") id: number, @Res() res: Response) {
    return this.bannerService.getBannerById(id, res)
  }

  // ============================================
  //           POST UPLOAD IMG BANNER
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Post("/")
  @UseInterceptors(FileInterceptor("hinh_anh"))

  postImgBanner(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadDto_banner,
    @Res() res: Response) {

    return this.bannerService.postImgBanner(file, body, res)
  }

  // ============================================
  //           PUT UPLOAD IMG BANNER
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Put("/:id")
  @UseInterceptors(FileInterceptor("hinh_anh"))

  putImgBanner(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: number,
    @Body() body: FileUploadDto_banner,
    @Res() res: Response) {

    return this.bannerService.putImgBanner(file, id, body, res)
  }

  // ============================================
  //                DELETE IMG BANNER
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteBanner(@Param("id") id: number, @Res() res: Response) {
    return this.bannerService.deleteBanner(id, res)
  }


}
