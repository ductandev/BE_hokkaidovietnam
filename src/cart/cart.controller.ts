import { CartService } from './cart.service';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { CreateCartDto } from './dto/create-cart.dto';


@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("GioHang")
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  // ============================================
  //            GET ALL CART
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("/")
  getAll(@Res() res: Response) {
    return this.cartService.getAll(res)
  }

  // ============================================
  //         GET CART BY USER ID
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("/:userID")
  getCartByUserId(@Param("userID") userID: number, @Res() res: Response) {
    return this.cartService.getCartByUserId(userID, res)
  }

  // ============================================
  //                 POST CART
  // ============================================
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
  @Post("/")
  postCart(@Body() body: CreateCartDto, @Res() res: Response) {
    return this.cartService.postCart(body, res)
  }

  // ============================================
  //               DELETE CART 
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Delete("/:id")
  deleteCart(@Param("id") id: number, @Res() res: Response) {
    return this.cartService.deleteCart(id, res)
  }

}
