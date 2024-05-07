import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put } from '@nestjs/common';
import { CommentService } from './comment.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { CreateCommentDto } from './dto/create-comment.dto';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';


@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("BinhLuan")
@Controller('api/comment/')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // ============================================
  //            GET ALL COMMENT
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN)
  @Get("/")
  getAllComment(@Res() res: Response) {
    return this.commentService.getAllComment(res)
  }


  // ============================================
  //         GET COMMENT BY USER ID
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("/:userID")
  getCommentByUserId(@Param("userID") userID: number, @Res() res: Response) {
    return this.commentService.getCommentByUserId(userID, res)
  }


  // ============================================
  //         GET COMMENT BY PRODUCT ID
  // ============================================ 
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get("product/:productID")
  getCommentByProductId(@Param("productID") productID: number, @Res() res: Response) {
    return this.commentService.getCommentByProductId(productID, res)
  }


  // ============================================
  //               POST COMMENT 
  // ============================================
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post("/")
  postComment(@Body() body: CreateCommentDto, @Res() res: Response) {
    return this.commentService.postComment(body, res)
  }


  // ============================================
  //               PUT COMMENT 
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put("/:commentID")
  putComment(@Param("commentID") commentID: number, @Body() body: CreateCommentDto, @Res() res: Response) {
    return this.commentService.putComment(commentID, body, res)
  }


  // ============================================
  //               DELETE COMMENT 
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete("/:commentID")
  deleteComment(@Param("commentID") commentID: number, @Res() res: Response) {
    return this.commentService.deleteComment(commentID, res)
  }
}
