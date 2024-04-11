import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

import { CreateProductTypeDto } from './dto/create-product-type.dto';

@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("LoaiSanPham")
@Controller('api/product-type/')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) { }


  // ============================================
  //            GET ALL TYPE PRODUCTS
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-all-product-type")
  getAllProductType(@Res() res: Response) {
    return this.productTypeService.getAllProductType(res)
  }

  // ============================================
  //       GET NAME PRODUCT TYPE BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-product-type-by-id/:productTypeID")
  getProductTypeById(@Param("productTypeID") productTypeID: number, @Res() res: Response) {
    return this.productTypeService.getProductTypeById(productTypeID, res)
  }

  // ============================================
  //       GET PRODUCT TYPE BY NAME
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-product-type-by-name/:nameProductType")
  getNameProductType(@Param("nameProductType") nameProductType: string, @Res() res: Response) {
    return this.productTypeService.getNameProductType(nameProductType, res)
  }

  // ============================================
  //      GET PANIGATION LIST PRODUCT TYPE
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-panigation-product-type/:pageIndex/:pageSize")
  getPanigationProductType(
    @Param("pageIndex") pageIndex: number,
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.productTypeService.getPanigationProductType(pageIndex, pageSize, res)
  }

  // ============================================
  //            POST PRODUCT TYPE 
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("post-product-type")
  postProductType(@Body() body: CreateProductTypeDto, @Res() res: Response) {
    return this.productTypeService.postProductType(body, res)
  }

  // ============================================
  //             PUT PRODUCT TYPE 
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Put("put-product-type/:productTypeID")
  putProductType(@Param("productTypeID") productTypeID: number, @Body() body: CreateProductTypeDto, @Res() res: Response) {
    return this.productTypeService.putProductType(productTypeID, body, res)
  }

  // ============================================
  //            DELETE PRODUCT TYPE 
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-product-type/:productTypeID")
  deleteProductType(@Param("productTypeID") productTypeID: number, @Res() res: Response) {
    return this.productTypeService.deleteProductType(productTypeID, res)
  }



}