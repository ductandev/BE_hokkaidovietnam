import { Controller, Post, Body, Patch, Param, Delete, HttpCode, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dto/auth.dto';
import { UserSignUpType } from './entities/auth.entity';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';



@ApiTags("Auth")
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // =============================================
  //                  ĐĂNG NHẬP
  // =============================================
  @HttpCode(200)
  @Post("/sign-in")
  signIn(@Body() body: UserSignInDto, @Res() res: Response) {
    return this.authService.signIn(body, res);
  }

  // =============================================
  //                  ĐĂNG KÝ
  // =============================================
  @HttpCode(201)
  @Post("/sign-up")
  signUp(@Body() body: UserSignUpType, @Res() res: Response) {
    // Việc validation sẽ được thực hiện tự động trước khi hàm này được gọi
    // Nếu dữ liệu không hợp lệ, NestJS sẽ tự động trả về response lỗi
    // Nếu dữ liệu hợp lệ, createUserDto sẽ chứa dữ liệu được validate
    return this.authService.signUp(body, res);
  }

  // =============================================
  //                  QUÊN MẬT KHẨU
  // =============================================
  @HttpCode(200)
  @Get("/forgot-password")
  sendMailer(@Res() res: Response) {
    return this.authService.sendMailer(res)
  }

}
