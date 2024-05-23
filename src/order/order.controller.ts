import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

import { CreateOrderDto } from './dto/create-order.dto';


@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("DonHang")
@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // ============================================
  //            GET ALL ORDER
  // ============================================ 
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get("/")
  getAllOrder(@Res() res: Response) {
    return this.orderService.getAllOrder(res)
  }

  // ==================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY NAME
  // ==================================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get('pagination')
  getAllPagination(
    @Query('status') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('ho_ten') ho_ten: string,
    @Query('dia_chi') dia_chi: string,
    @Query('phuong_id') phuong_id: string,
    @Query('quan_id') quan_id: string,
    @Query('tinh_thanh_id') tinh_thanh_id: string,
    @Query('so_dien_thoai') so_dien_thoai: string,
    @Res() res: Response,
  ) {
    return this.orderService.getAllPagination(
      typeID,
      pageIndex,
      pageSize,
      ho_ten,
      dia_chi,
      phuong_id,
      quan_id,
      tinh_thanh_id,
      so_dien_thoai,
      res,
    );
  }

  // =====================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY ADDRESS
  // =====================================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get('address/pagination')
  getAllPaginationAddress(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('dia_chi') search: string,
    @Res() res: Response,
  ) {
    return this.orderService.getAllPaginationAddress(
      typeID,
      pageIndex,
      pageSize,
      search,
      res,
    );
  }

  // =====================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY WARD
  // =====================================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get('ward/pagination')
  getAllPaginationWard(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('phuong_id') phuong_id: string,
    @Res() res: Response,
  ) {
    return this.orderService.getAllPaginationWard(
      typeID,
      pageIndex,
      pageSize,
      phuong_id,
      res,
    );
  }

  // =====================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY DISSTRICT
  // =====================================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get('district/pagination')
  getAllPaginationDistrict(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('quan_id') quan_id: string,
    @Res() res: Response,
  ) {
    return this.orderService.getAllPaginationDistrict(
      typeID,
      pageIndex,
      pageSize,
      quan_id,
      res,
    );
  }

  // =======================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY PROVINCE
  // =======================================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get('province/pagination')
  getAllPaginationProvince(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('tinh_thanh_id') tinh_thanh_id: string,
    @Res() res: Response,
  ) {
    return this.orderService.getAllPaginationProvince(
      typeID,
      pageIndex,
      pageSize,
      tinh_thanh_id,
      res,
    );
  }

  // =======================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY PHONE
  // =======================================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get('phone/pagination')
  getAllPaginationPhone(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('so_dien_thoai') so_dien_thoai: string,
    @Res() res: Response,
  ) {
    return this.orderService.getAllPaginationPhone(
      typeID,
      pageIndex,
      pageSize,
      so_dien_thoai,
      res,
    );
  }

  // ============================================
  //            GET ALL ORDER SUMARY
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Get("summary")
  getOrderSummary(@Res() res: Response) {
    return this.orderService.getOrderSummary(res)
  }

  // ============================================
  //             GET ORDER BY ID
  // ============================================ 
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get("/:id")
  getOrderById(@Param("id") id: number, @Res() res: Response) {
    return this.orderService.getOrderById(id, res)
  }

  // ============================================
  //         GET ORDER BY USER PHONE
  // ============================================ 
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get("user/:phone")
  getOrderByUserId(@Param("phone") phone: string, @Res() res: Response) {
    return this.orderService.getOrderByUserId(phone, res)
  }

  // ============================================
  //               POST ORDER
  // ============================================
  @HttpCode(201)
  // @Roles(Role.ADMIN, Role.USER)
  @Post("/")
  postOrder(@Body() body: CreateOrderDto, @Res() res: Response) {
    return this.orderService.postOrder(body, res)
  }

  // ============================================
  //               PUT ORDER
  // ============================================
  // @HttpCode(201)
  // @Roles(Role.ADMIN)
  // @Put("/:id")
  // putOrderById(@Param("id") id: number, @Body() body: CreateOrderDto, @Res() res: Response) {
  //   return this.orderService.putOrderById(id, body, res)
  // }

  // ============================================
  //            DELETE ORDER  
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteOrderById(@Param("id") id: number, @Res() res: Response) {
    return this.orderService.deleteOrderById(id, res)
  }

}
