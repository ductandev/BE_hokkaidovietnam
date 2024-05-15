import { DiscountService } from './discount.service';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFiles, Patch, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response, query } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { CreateDiscountDto, NameDiscountDto } from './dto/create-discount.dto';

@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('GiamGia')
@Controller('api/discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }

  // ============================================
  //            GET ALL DISCOUNT
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Get('/')
  getAllDiscount(@Res() res: Response) {
    return this.discountService.getAllDiscount(res);
  }

  // ============================================
  // GET ALL DISCOUNT PAGINATION BY SEARCH
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Get('pagination')
  getAllPagination(
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    return this.discountService.getAllPagination(
      pageIndex,
      pageSize,
      search,
      res
    );
  }

  // ============================================
  //             GET DISCOUNT BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("/:id")
  getById(@Param("id") id: number, @Res() res: Response) {
    return this.discountService.getById(id, res)
  }

  // ============================================
  //             GET DISCOUNT BY NAME
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("check/name")
  getByName(
    @Body() body: NameDiscountDto,
    @Res() res: Response
  ) {
    return this.discountService.getByName(body, res)
  }

  // ============================================
  //               POST DISCOUNT
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("/create")
  postDiscount(
    @Body() body: CreateDiscountDto,
    @Res() res: Response
  ) {
    return this.discountService.postDiscount(body, res)
  }

  // ============================================
  //               PUT DISCOUNT
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Put("/:id")
  putDiscountbyId(
    @Param("id") id: number,
    @Body() body: CreateDiscountDto,
    @Res() res: Response
  ) {
    return this.discountService.putDiscountbyId(id, body, res)
  }

  // ============================================
  //            DELETE DISCOUNT  
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteOrderById(
    @Param("id") id: number,
    @Res() res: Response) {
    return this.discountService.deleteOrderById(id, res)
  }

}
