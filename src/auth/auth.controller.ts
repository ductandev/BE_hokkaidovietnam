import { Controller, Post, Body, Patch, Param, Delete, HttpCode, Res } from '@nestjs/common';
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
  @Post("/signin")
  signIn(@Body() body: UserSignInDto, @Res() res: Response) {
    return this.authService.signIn(body, res);
  }

  // =============================================
  //                  ĐĂNG KÝ
  // =============================================
  @HttpCode(201)
  @Post("/signup")
  signUp(@Body() body: UserSignUpType, @Res() res: Response) {
    return this.authService.signUp(body, res);
  }

}
