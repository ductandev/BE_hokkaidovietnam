import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
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
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("Banner")
@Controller('api/banner/')
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  // ============================================
  //            GET ALL BANNER
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-all-banner")
  getAllBanner(@Res() res: Response) {
    return this.bannerService.getAllBanner(res)
  }

  // ============================================
  //           GET NAME BANNER BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-banner-by-id/:bannerID")
  getBannerById(@Param("bannerID") bannerID: number, @Res() res: Response) {
    return this.bannerService.getBannerById(bannerID, res)
  }

  // ============================================
  //      GET PANIGATION LIST BANNER
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-panigation-banner/:pageIndex/:pageSize")
  getPanigationBanner(
    @Param("pageIndex") pageIndex: number,
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.bannerService.getPanigationBanner(pageIndex, pageSize, res)
  }

  // ============================================
  //           POST UPLOAD IMG BANNER
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("post-banner")
  @UseInterceptors(FileInterceptor("hinhAnh"))

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
  @Roles(Role.ADMIN)
  @Put("put-banner/:bannerID")
  @UseInterceptors(FileInterceptor("hinhAnh"))

  putImgBanner(
    @UploadedFile() file: Express.Multer.File,
    @Param("bannerID") bannerID: number,
    @Body() body: FileUploadDto_banner,
    @Res() res: Response) {

    return this.bannerService.putImgBanner(file, bannerID, body, res)
  }


  // ============================================
  //                DELETE IMG BANNER
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-banner/:bannerID")
  deleteBanner(@Param("bannerID") bannerID: number, @Res() res: Response) {
    return this.bannerService.deleteBanner(bannerID, res)
  }


}
