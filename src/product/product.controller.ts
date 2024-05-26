import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFiles, Patch, Query } from '@nestjs/common';
import { ProductService } from './product.service';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUploadDto_product } from './dto/upload.dto';

@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('SanPham')
@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // ============================================
  //            GET ALL PRODUCTS
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('/')
  getAllProducts(@Res() res: Response) {
    return this.productService.getAllProducts(res);
  }

  // ============================================
  // GET ALL PRODUCTS PAGINATION BY TYPE_ID SEARCH
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('pagination')
  getAllProductsByTypeId(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    return this.productService.getAllProductsByTypeId(
      typeID,
      pageIndex,
      pageSize,
      search,
      res,
    );
  }

  // ============================================
  //            GET ALL PRODUCT SUMARY
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN)
  @Get("summary")
  getUserSummary(@Res() res: Response) {
    return this.productService.getUserSummary(res)
  }


  // ============================================
  //          GET PRODUCT BY ID
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('/:id')
  getProductById(@Param('id') id: number, @Res() res: Response) {
    return this.productService.getProductById(id, res);
  }

  // ============================================
  //           GET PRODUCT BY NAME
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('name/:name')
  getNameProduct(
    @Param('name') name: string,
    @Res() res: Response,
  ) {
    return this.productService.getNameProduct(name, res);
  }

  // ============================================
  //        POST PRODUCT ARRAY STRING IMG
  // ============================================
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Post('/')
  postProduct(
    @Body() body: CreateProductDto,
    @Res() res: Response,
  ) {
    return this.productService.postProduct(body, res);
  }

  // ============================================
  //             POST PRODUCT FILE IMG
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Post('/create')
  @UseInterceptors(FilesInterceptor('hinh_anh', 20))
  postCreateProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateProductDto,
    @Res() res: Response,
  ) {
    return this.productService.postCreateProduct(files, body, res);
  }


  // ============================================
  //             PUT PRODUCT INFO
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Put('info/:id')
  putRoom(
    @Param('id') id: number,
    @Body() body: UpdateProductDto,
    @Res() res: Response,
  ) {
    return this.productService.putProduct(id, body, res);
  }

  // ============================================
  //             PUT PRODUCT IMAGE
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Put('img/:id')
  @UseInterceptors(FilesInterceptor('hinh_anh', 20))
  putProductImg(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: number,
    @Body() body: FileUploadDto_product,
    @Res() res: Response,
  ) {
    return this.productService.putProductImg(files, id, body, res);
  }

  // ============================================
  //              DELETE PRODUCT
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  deleteProduct(@Param('id') id: number, @Res() res: Response) {
    return this.productService.deleteProduct(id, res);
  }
}
