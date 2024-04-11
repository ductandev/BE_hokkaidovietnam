import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFiles, Patch } from '@nestjs/common';
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
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("SanPham")
@Controller('api/product/')
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  // ============================================
  //            GET ALL PRODUCTS
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-all-product")
  getAllProducts(@Res() res: Response) {
    return this.productService.getAllProducts(res)
  }

  // ============================================
  //          GET NAME PRODUCT BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-product-by-id/:productID")
  getProductById(@Param("productID") productID: number, @Res() res: Response) {
    return this.productService.getProductById(productID, res)
  }

  // ============================================
  //           GET PRODUCT BY NAME
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-product-by-name/:nameProduct")
  getNameProduct(@Param("nameProduct") nameProduct: string, @Res() res: Response) {
    return this.productService.getNameProduct(nameProduct, res)
  }

  // ============================================
  //        GET PANIGATION LIST PRODUCT
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-panigation-product/:pageIndex/:pageSize")
  getPanigationProduct(
    @Param("pageIndex") pageIndex: number,
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.productService.getPanigationProduct(pageIndex, pageSize, res)
  }

  // ============================================
  //               POST PRODUCT  
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("post-product")
  @UseInterceptors(FilesInterceptor("hinhAnh", 20))
  postProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateProductDto,
    @Res() res: Response) {
    return this.productService.postProduct(files, body, res)
  }

  // ============================================
  //             PUT PRODUCT INFO
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Put("put-product-info/:productID")
  putRoom(@Param("productID") productID: number, @Body() body: UpdateProductDto, @Res() res: Response) {
    return this.productService.putProduct(productID, body, res)
  }


  // ============================================
  //             PUT PRODUCT IMAGE
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Put("put-product-img/:productID")
  @UseInterceptors(FilesInterceptor("hinhAnh", 20))
  putProductImg(
    @UploadedFiles() files: Express.Multer.File[],
    @Param("productID") productID: number,
    @Body() body: FileUploadDto_product,
    @Res() res: Response) {
    return this.productService.putProductImg(files, productID, body, res)
  }

  // ============================================
  //              DELETE PRODUCT  
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-product/:productID")
  deleteProduct(@Param("productID") productID: number, @Res() res: Response) {
    return this.productService.deleteProduct(productID, res)
  }

}
