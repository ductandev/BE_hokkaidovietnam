import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { errorCode, failCode, successCode } from 'src/Config/response';
import { Response } from 'express';
// THƯ VIỆN MÃ HÓA PASSWORD
// yarn add bcrypt
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/auth.dto';
import { UserSignUpType } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  model = new PrismaClient();


  // =============================================
  //                  ĐĂNG NHẬP
  // =============================================
  async signIn(body: UserSignInDto, res: Response) {
    try {
      let { email, mat_khau } = body;

      let checkEmail = await this.model.nguoiDung.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail) {
        // check password
        let checkPass = bcrypt.compareSync(mat_khau, checkEmail.mat_khau);    //: tham số 1: dữ liệu chưa mã hóa, tham số 2: dữ liệu đã mã hóa
        if (checkPass == true) {
          // ⭐ để 30day ⭐
          let token = this.jwtService.sign({ data: checkEmail }, { expiresIn: '30d', secret: 'NODE' },); // Khóa bí mật bên files "jwt.strategy.ts"
          successCode(res, token, 200, 'Login thành công !');
        } else {
          failCode(res, '', 400, 'Mật khẩu không đúng !');
        }
      } else {
        failCode(res, '', 400, 'Email không đúng hoặc chưa đăng ký !');
      }
    } catch (exception) {
      console.log('🚀 ~ file: auth.service.ts:46 ~ AuthService ~ signIn ~ exception:', exception,);
      errorCode(res, 'Lỗi BE');
    }
  }


  // =============================================
  //                  ĐĂNG KÝ
  // =============================================
  async signUp(body: UserSignUpType, res: Response) {
    try {
      let { ho_ten, email, mat_khau, so_dien_thoai, anh_dai_dien, gioi_tinh } = body;

      let checkEmail = await this.model.nguoiDung.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail !== null) {
        return failCode(res, '', 400, 'Email đã tồn tại !');
      }

      // mã hóa mật khẩu
      let newData = {
        ho_ten,
        email,
        mat_khau: await bcrypt.hash(mat_khau, 10), //  thay đổi bcrypt.hashSync thành await bcrypt.hash để sử dụng hàm hash bất đồng bộ. Điều này cần thiết để tránh blocking thread chính khi mã hóa mật khẩu.
        so_dien_thoai,
        anh_dai_dien,
        gioi_tinh,
      };

      await this.model.nguoiDung.create({
        data: newData,
      });

      successCode(res, newData, 201, 'Thêm mới thành công !');
    } catch (exception) {
      console.log("🚀 ~ file: auth.service.ts:87 ~ AuthService ~ signUp ~ exception:", exception)
      errorCode(res, 'Lỗi BE');
      // errorCode(res, `Lỗi BE: ${exception}`);
    }
  }
}