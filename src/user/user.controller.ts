import { Controller, Get, Post, Body, Param, Delete, HttpCode, Res, UseGuards, Put, UseInterceptors, UploadedFile, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserUpdateDto } from './dto/update-user.dto';
import { FileUploadDto_user } from './dto/upload.dto';

import { Role } from './entities/role.enum';
import { Roles } from '../decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Response } from 'express';



@ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"))
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("NguoiDung")
@Controller('api/user')
export class UserController {

  constructor(private readonly userService: UserService,) { }


  // ============================================
  // LẤY THÔNG TIN CHI TIẾT TẤT CẢ NGƯỜI DÙNG
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Get("get-info-all-user")
  getInforAllUser(@Res() res: Response) {
    return this.userService.getInforAllUser(res)
  }

  // ============================================
  // LẤY THÔNG TIN CHI TIẾT NGƯỜI DÙNG BY USER_ID
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-info-user-by-user-id/:userId")
  getInfoUserByUserId(@Param("userId") userId: string, @Res() res: Response) {
    return this.userService.getInfoUserByUserId(userId, res)
  }

  // ============================================
  //    LẤY DANH SÁCH NGƯỜI DÙNG PHÂN TRANG
  // ============================================
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-list-user-panigation/:pageIndex/:pageSize")
  getListUserPanigation(
    @Param("pageIndex") pageIndex: number,
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.userService.getListUserPanigation(pageIndex, pageSize, res)
  }

  // ============================================
  //        TÌM TÊN NGƯỜI DÙNG THEO TÊN
  // ============================================ 
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("search-user-by-name/:userName")
  searchUserByName(@Param("userName") userName: string, @Res() res: Response) {
    return this.userService.searchUserByName(userName, res)
  }


  // ============================================
  //      CẬP NHẬT ẢNH ĐẠI DIỆN NGƯỜI DÙNG
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
  @Post("upload-avatar/:userID")
  @UseInterceptors(FileInterceptor("hinhAnh"))     // Tham số 1: key FE gửi lên

  // ************* CÁCH DƯỚI NÀY ĐỂ UPLOAD LƯU VÀO LOCAL SOURCE BE ***************
  // @UseInterceptors(FileInterceptor("hinhAnh",     // Tham số 1: key FE gửi lên
  //   {                                             // Tham số 2: định nghĩa nơi lưu, và lưu tên mới cho file
  //     storage: diskStorage({
  //       destination: process.cwd() + "/public/img",
  //       filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname) // null: tham số báo lỗi
  //     })
  //   }
  // ))    // Sử dụng một middleware, cho phép chèn phía trước khi truy cập API

  uploadImg(
    @UploadedFile() file: Express.Multer.File,
    @Param("userID") userID: number,
    @Body() body: FileUploadDto_user,
    @Res() res: Response) {

    return this.userService.uploadImg(file, userID, body, res)
  }

  // ============================================
  //             CẬP NHẬT NGƯỜI DÙNG 
  // ============================================  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Put("update-user/:userId")
  updateUserById(@Param("userId") userId: string, @Body() body: UserUpdateDto, @Res() res: Response) {
    return this.userService.updateUserById(userId, body, res)
  }

  // ============================================
  //               XÓA NGƯỜI DÙNG 
  // ============================================  
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-user/:userId")
  deleteUserById(@Param("userId") userId: string, @Res() res: Response) {
    return this.userService.deleteUserById(userId, res)
  }



  // Cách lấy biến môi trường nestjs
  // @Get("/get-dotenv")
  // getEnv() {
  //   return this.configService.get("TITLE")
  // }
}
