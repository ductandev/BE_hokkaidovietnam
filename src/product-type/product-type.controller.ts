import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, Query } from '@nestjs/common';
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
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("LoaiSanPham")
@Controller('api/product-type/')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) { }


  // ============================================
  //            GET ALL TYPE PRODUCTS
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("/")
  getAllProductType(@Res() res: Response) {
    return this.productTypeService.getAllProductType(res)
  }

  // ============================================
  //      GET PANIGATION LIST PRODUCT TYPE
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  // @Get("get-pagination-product-type/:pageIndex/:pageSize")
  @Get("pagination")
  getPanigationProductType(
    @Query("page") pageIndex: number,
    @Query("limit") pageSize: number,
    @Res() res: Response
  ) {
    return this.productTypeService.getPanigationProductType(pageIndex, pageSize, res)
  }

  // ============================================
  //       GET NAME PRODUCT TYPE BY ID
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("/:id")
  getProductTypeById(@Param("id") id: number, @Res() res: Response) {
    return this.productTypeService.getProductTypeById(id, res)
  }

  // ============================================
  //       GET PRODUCT TYPE BY NAME
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("name/:name")
  getNameProductType(@Param("name") name: string, @Res() res: Response) {
    return this.productTypeService.getNameProductType(name, res)
  }

  // ============================================
  //            POST PRODUCT TYPE 
  // ============================================
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Post("/")
  postProductType(@Body() body: CreateProductTypeDto, @Res() res: Response) {
    return this.productTypeService.postProductType(body, res)
  }

  // ============================================
  //             PUT PRODUCT TYPE 
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Put("/:id")
  putProductType(@Param("id") id: number, @Body() body: CreateProductTypeDto, @Res() res: Response) {
    return this.productTypeService.putProductType(id, body, res)
  }

  // ============================================
  //            DELETE PRODUCT TYPE 
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteProductType(@Param("id") id: number, @Res() res: Response) {
    return this.productTypeService.deleteProductType(id, res)
  }

}