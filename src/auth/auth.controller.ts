import { Controller, Post, Body, HttpCode, Res, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, UserSignInDto } from './dto/auth.dto';
import { UserSignUpType } from './entities/auth.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
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
  @Post("/forgot-password")
  sendMailer(
    @Body() body: ForgotPasswordDto,
    @Res() res: Response) {
    return this.authService.sendMailer(body, res)
  }

  // =============================================
  //                  RELOAD
  // =============================================
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get("/reload")
  getReload(
    @Request() req: Request,
    @Res() res: Response
  ) {
    return this.authService.getReload(req, res)
  }

}
