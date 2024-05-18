import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { errorCode, failCode, successCode, successCodeAuth } from 'src/Config/response';
import { Response } from 'express';
// THƯ VIỆN MÃ HÓA PASSWORD
// yarn add bcrypt
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/auth.dto';
import { UserSignUpType } from './entities/auth.entity';
// Thư viện gửi email


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) { }

  model = new PrismaClient();


  // =============================================
  //                  ĐĂNG NHẬP
  // =============================================
  async signIn(body: UserSignInDto, res: Response) {
    try {
      // -------------------------------------------
      // Đăng nhập bằng cả email và số điện thoại
      // -------------------------------------------
      let { email_or_phone, mat_khau } = body;

      let user = await this.model.nguoiDung.findFirst({
        where: {
          OR: [
            { email: email_or_phone },
            { so_dien_thoai: email_or_phone }
          ],
          // email,
          // vai_tro_id: { not: 3 }
          // Loại bỏ trường hợp có "vai_tro_id = 3" hoặc "mat_khau =rỗng "
          NOT: [
            { vai_tro_id: 3 },
            { mat_khau: '' }
          ],
          isDelete: false
        },
      });

      if (user) {
        // check password
        let checkPass = bcrypt.compareSync(mat_khau, user.mat_khau);    //: tham số 1: dữ liệu chưa mã hóa, tham số 2: dữ liệu đã mã hóa
        if (checkPass == true) {
          // ⭐ để 30day ⭐
          let token = this.jwtService.sign({ data: user }, { secret: 'NODE' },); // Khóa bí mật bên files "jwt.strategy.ts"
          successCodeAuth(res, user, token, 200, 'Login thành công !');
        } else {
          failCode(res, '', 400, 'Mật khẩu không đúng !');
        }
      } else {
        failCode(res, '', 400, 'Email hoặc SĐT không đúng hoặc chưa được đăng ký !');
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
      let { ho_ten, email, mat_khau, dia_chi, phuong_id, quan_id, tinh_thanh_id, so_dien_thoai, gioi_tinh } = body;

      let checkUserEmail = await this.model.nguoiDung.findMany({
        where: {
          email,
          isDelete: false
        },
      });

      // Kiểm tra xem trong danh sách người dùng đã có Email với vai_tro_id là 2 hay không
      if (checkUserEmail.some(user => user.vai_tro_id !== 3)) {
        return failCode(res, '', 400, 'Email đã được đăng ký trước đó !');
      }

      let checkUserPhone = await this.model.nguoiDung.findMany({
        where: {
          so_dien_thoai,
          isDelete: false
        },
      });

      // Kiểm tra xem trong danh sách người dùng đã có SĐT với vai_tro_id là 2 hay không
      if (checkUserPhone.some(user => user.vai_tro_id !== 3)) {
        return failCode(res, '', 400, 'Số điện thoại đã được đăng ký trước đó !');
      }


      // Nếu không có người dùng nào với vai_tro_id là 2, và chỉ có nhiều người dùng với vai_tro_id là 3,
      // thì tạo tài khoản mới cho người dùng với vai_tro_id là 3
      if (checkUserPhone.length !== 0 && checkUserPhone[0].vai_tro_id === 3 && checkUserPhone[0].mat_khau === '') {
        const updateInfoUser = await this.model.nguoiDung.update({
          where: {
            nguoi_dung_id: checkUserPhone[0].nguoi_dung_id,
            isDelete: false
          },
          data: {
            vai_tro_id: 2,
            ho_ten,
            email,
            mat_khau: await bcrypt.hash(mat_khau, 10),
            dia_chi,
            phuong_id,
            quan_id,
            tinh_thanh_id,
            so_dien_thoai,
            gioi_tinh
          }
        });
        return successCode(res, updateInfoUser, 201, 'Đăng ký thành công !');
      }


      let newData = {
        ho_ten,
        email,
        mat_khau: await bcrypt.hash(mat_khau, 10), //  thay đổi bcrypt.hashSync thành await bcrypt.hash để sử dụng hàm hash bất đồng bộ. Điều này cần thiết để tránh blocking thread chính khi mã hóa mật khẩu.
        dia_chi,
        phuong_id,
        quan_id,
        tinh_thanh_id,
        so_dien_thoai,
        gioi_tinh,
      };

      await this.model.nguoiDung.create({
        data: newData,
      });

      successCode(res, newData, 201, 'Đăng ký thành công !');
    } catch (exception) {
      console.log("🚀 ~ file: auth.service.ts:137 ~ AuthService ~ signUp ~ exception:", exception);
      errorCode(res, 'Lỗi BE');
      // errorCode(res, `Lỗi BE: ${exception}`);
    }
  }

  // =============================================
  //                  QUÊN MẬT KHẨU
  // =============================================




}