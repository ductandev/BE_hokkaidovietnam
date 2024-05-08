import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, Query } from '@nestjs/common';
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
  @Roles(Role.ADMIN)
  @Get("/")
  getAllOrderDetail(@Res() res: Response) {
    return this.orderDetailService.getAllOrderDetail(res)
  }

  // ============================================
  //       GET DETAIL "ORDER-DETAIL" BY ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("/:id")
  getOrderDetailById(@Param("id") id: number, @Res() res: Response) {
    return this.orderDetailService.getOrderDetailById(id, res)
  }

  // ============================================
  //             POST "ORDER-DETAIL"
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("")
  postOrderDetail(@Body() body: CreateOrderDetailDto, @Res() res: Response) {
    return this.orderDetailService.postOrderDetail(body, res)
  }

  // ============================================
  //               PUT "ORDER-DETAIL"
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Put("/:id")
  putOrderDetailById(
    @Param("id") id: number,
    @Body() body: CreateOrderDetailDto,
    @Res() res: Response
  ) {
    return this.orderDetailService.putOrderDetailById(id, body, res)
  }

  // ============================================
  //            DELETE "ORDER-DETAIL"  
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteOrderDetailById(@Param("id") id: number, @Res() res: Response) {
    return this.orderDetailService.deleteOrderDetailById(id, res)
  }
}
