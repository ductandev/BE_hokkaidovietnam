import { Controller, Get, Post, Body, Param, Delete, HttpCode, Res, UseGuards, Put, UseInterceptors, UploadedFile, SetMetadata, Query } from '@nestjs/common';
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
    @Get("/")
    getInforAllUser(@Res() res: Response) {
        return this.userService.getInforAllUser(res)
    }


    // ============================================
    //    LẤY DANH SÁCH NGƯỜI DÙNG PHÂN TRANG
    // ============================================
    @HttpCode(200)
    @Roles(Role.ADMIN)
    @Get('pagination')
    getListUserPanigation(
        @Query('vaiTroID') vaiTroID: number,
        @Query('page') pageIndex: number,
        @Query('limit') pageSize: number,
        @Query('search') search: string,
        @Res() res: Response,
    ) {
        return this.userService.getListUserPanigation(
            vaiTroID,
            pageIndex,
            pageSize,
            search,
            res,
        );
    }

    // ============================================
    //            GET ALL USER SUMARY
    // ============================================
    @HttpCode(200)
    @Roles(Role.ADMIN)
    @Get("summary")
    getUserSummary(@Res() res: Response) {
        return this.userService.getUserSummary(res)
    }


    // ============================================
    // LẤY THÔNG TIN CHI TIẾT NGƯỜI DÙNG BY USER_ID
    // ============================================
    @HttpCode(200)
    @Roles(Role.ADMIN, Role.USER)
    @Get("/:id")
    getInfoUserByUserId(@Param("id") id: number, @Res() res: Response) {
        return this.userService.getInfoUserByUserId(id, res)
    }

    // ============================================
    // LẤY THÔNG TIN CHI TIẾT NGƯỜI DÙNG BY USER_ID
    // ============================================
    @HttpCode(200)
    @Roles(Role.ADMIN, Role.USER)
    @Get("order/history/:id")
    getOrderHistoryUserId(@Param("id") id: number, @Res() res: Response) {
        return this.userService.getOrderHistoryUserId(id, res)
    }


    // ============================================
    //        TÌM NGƯỜI DÙNG THEO TÊN
    // ============================================
    @HttpCode(200)
    @Roles(Role.ADMIN)
    @Get("name/:name")
    searchUserByName(@Param("name") name: string, @Res() res: Response) {
        return this.userService.searchUserByName(name, res)
    }


    // ============================================
    //      CẬP NHẬT ẢNH ĐẠI DIỆN NGƯỜI DÙNG
    // ============================================
    @ApiConsumes('multipart/form-data')
    @HttpCode(201)
    @Roles(Role.ADMIN, Role.USER)
    @Post("upload-avatar/:id")
    @UseInterceptors(FileInterceptor("hinh_anh"))     // Tham số 1: key FE gửi lên

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
        @Param("id") id: number,
        @Body() body: FileUploadDto_user,
        @Res() res: Response) {

        return this.userService.uploadImg(file, id, body, res)
    }

    // ============================================
    //             CẬP NHẬT NGƯỜI DÙNG
    // ============================================
    @HttpCode(200)
    @Roles(Role.ADMIN, Role.USER)
    @Put("/:id")
    updateUserById(@Param("id") id: string, @Body() body: UserUpdateDto, @Res() res: Response) {
        return this.userService.updateUserById(id, body, res)
    }

    // ============================================
    //               XÓA NGƯỜI DÙNG
    // ============================================
    @HttpCode(200)
    @Roles(Role.ADMIN)
    @Delete("/:id")
    deleteUserById(@Param("id") id: string, @Res() res: Response) {
        return this.userService.deleteUserById(id, res)
    }



    // Cách lấy biến môi trường nestjs
    // @Get("/get-dotenv")
    // getEnv() {
    //   return this.configService.get("TITLE")
    // }
}
