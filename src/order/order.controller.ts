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
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("DonHang")
@Controller('api/order/')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // ============================================
  //            GET ALL ORDER
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-all-order")
  getAllOrder(@Res() res: Response) {
    return this.orderService.getAllOrder(res)
  }

  // ============================================
  //             GET ORDER BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-order-by-id/:orderID")
  getOrderById(@Param("orderID") orderID: number, @Res() res: Response) {
    return this.orderService.getOrderById(orderID, res)
  }

  // ============================================
  //             GET ORDER BY USER ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-order-by-user-id/:userID")
  getOrderByUserId(@Param("userID") userID: number, @Res() res: Response) {
    return this.orderService.getOrderByUserId(userID, res)
  }

  // ============================================
  //        GET PANIGATION LIST ORDER
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  // @Get("get-pagination-order/:pageIndex/:pageSize")
  @Get("get-pagination-order")
  getPanigationOrder(
    @Query("page") pageIndex: number,
    @Query("limit") pageSize: number,
    @Res() res: Response
  ) {
    return this.orderService.getPanigationOrder(pageIndex, pageSize, res)
  }

  // ============================================
  //               POST ORDER
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
  @Post("post-order")
  postOrder(@Body() body: CreateOrderDto, @Res() res: Response) {
    return this.orderService.postOrder(body, res)
  }

  // ============================================
  //               PUT ORDER
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
  @Put("put-order/:orderID")
  putOrderById(@Param("orderID") orderID: number, @Body() body: CreateOrderDto, @Res() res: Response) {
    return this.orderService.putOrderById(orderID, body, res)
  }

  // ============================================
  //            DELETE ORDER  
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-order/:orderID")
  deleteOrderById(@Param("orderID") orderID: number, @Res() res: Response) {
    return this.orderService.deleteOrderById(orderID, res)
  }

}
