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
@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // ============================================
  //            GET ALL ORDER
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Get("/")
  getAllOrder(@Res() res: Response) {
    return this.orderService.getAllOrder(res)
  }

  // ============================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Get('pagination')
  getAllPagination(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    return this.orderService.getAllPagination(
      typeID,
      pageIndex,
      pageSize,
      search,
      res,
    );
  }

  // ============================================
  //            GET ALL ORDER SUMARY
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Get("summary")
  getOrderSummary(@Res() res: Response) {
    return this.orderService.getOrderSummary(res)
  }

  // ============================================
  //             GET ORDER BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("/:id")
  getOrderById(@Param("id") id: number, @Res() res: Response) {
    return this.orderService.getOrderById(id, res)
  }

  // ============================================
  //         GET ORDER BY USER PHONE
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("user/:phone")
  getOrderByUserId(@Param("phone") phone: string, @Res() res: Response) {
    return this.orderService.getOrderByUserId(phone, res)
  }


  // ============================================
  //               POST ORDER
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
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
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteOrderById(@Param("id") id: number, @Res() res: Response) {
    return this.orderService.deleteOrderById(id, res)
  }

}
