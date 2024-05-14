import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFiles, Patch, Query } from '@nestjs/common';
import { ContactService } from './contact.service';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { Role } from 'src/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('LienHe')
@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  // ============================================
  //            GET ALL CONTACT
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('/')
  getAll(@Res() res: Response) {
    return this.contactService.getAll(res);
  }

  // ============================================
  // GET ALL CONTACT PAGINATION BY TYPE_ID SEARCH
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('pagination')
  getAllPagination(
    @Query('typeID') typeID: number,
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    return this.contactService.getAllPagination(
      typeID,
      pageIndex,
      pageSize,
      search,
      res,
    );
  }

  // ============================================
  //                GET BY ID
  // ============================================
  @HttpCode(200)
  // @Roles(Role.ADMIN, Role.USER)
  @Get('/:id')
  getById(@Param('id') id: number, @Res() res: Response) {
    return this.contactService.getById(id, res);
  }

  // ============================================
  //               POST CONTACT
  // ============================================
  @HttpCode(201)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Post('/')
  postContact(
    @Body() body: CreateContactDto,
    @Res() res: Response,
  ) {
    return this.contactService.postContact(body, res);
  }

  // ============================================
  //               PUT CONTACT 
  // ============================================
  @HttpCode(20)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Put('/:id')
  putContact(
    @Param('id') id: number,
    @Body() body: UpdateContactDto,
    @Res() res: Response,
  ) {
    return this.contactService.putContact(id, body, res);
  }

  // ============================================
  //               DELETE CONTACT 
  // ============================================
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN)
  @Delete("/:id")
  deleteContact(@Param("id") id: number, @Res() res: Response) {
    return this.contactService.deleteContact(id, res)
  }
}
