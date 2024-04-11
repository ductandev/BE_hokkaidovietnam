import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';


@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("ChiTietDonHang")
@Controller('api/order-detail/')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) { }


  // ============================================
  //            GET ALL "ORDER-DETAIL"
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-all-order-detail")
  getAllOrderDetail(@Res() res: Response) {
    return this.orderDetailService.getAllOrderDetail(res)
  }

  // ============================================
  //       GET DETAIL "ORDER-DETAIL" BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-order-detail-by-id/:orderDetailID")
  getOrderDetailById(@Param("orderDetailID") orderDetailID: number, @Res() res: Response) {
    return this.orderDetailService.getOrderDetailById(orderDetailID, res)
  }

  // ============================================
  //   GET DETAIL "ORDER-DETAIL" BY DON_HANG_ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-order-detail-by-order-id/:orderID")
  getOrderDetailByOrderId(@Param("orderID") orderID: number, @Res() res: Response) {
    return this.orderDetailService.getOrderDetailByOrderId(orderID, res)
  }

  // ============================================
  //      GET PANIGATION LIST "ORDER-DETAIL"
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-panigation-order-detail/:pageIndex/:pageSize")
  getPanigationOrderDetail(
    @Param("pageIndex") pageIndex: number,
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.orderDetailService.getPanigationOrderDetail(pageIndex, pageSize, res)
  }

  // ============================================
  //             POST "ORDER-DETAIL"
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
  @Post("post-order-detail")
  postOrderDetail(@Body() body: CreateOrderDetailDto, @Res() res: Response) {
    return this.orderDetailService.postOrderDetail(body, res)
  }

  // ============================================
  //               PUT "ORDER-DETAIL"
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Put("put-order-detail/:orderDetailID")
  putOrderDetailById(@Param("orderDetailID") orderDetailID: number, @Body() body: CreateOrderDetailDto, @Res() res: Response) {
    return this.orderDetailService.putOrderDetailById(orderDetailID, body, res)
  }

  // ============================================
  //            DELETE "ORDER-DETAIL"  
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-order-detail/:orderDetailID")
  deleteOrderDetailById(@Param("orderDetailID") orderDetailID: number, @Res() res: Response) {
    return this.orderDetailService.deleteOrderDetailById(orderDetailID, res)
  }
}
