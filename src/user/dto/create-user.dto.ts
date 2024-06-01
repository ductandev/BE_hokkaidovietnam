import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Họ tên không được bỏ trống !' })
    @IsString()
    @Matches(/^[a-zA-Z\s áàảạãăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ ÁÀẢẠÃĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]+$/, { message: 'Họ tên chỉ được chứa ký tự chữ cái và khoảng trắng' })
    @ApiProperty()
    ho_ten?: string;

    @IsNotEmpty({ message: 'Email không được bỏ trống !' })
    @IsEmail()
    @ApiProperty()
    email?: string;

    @IsNotEmpty({ message: 'mật khẩu không được bỏ trống !' })
    @IsString()
    @Length(6, 32, { message: 'Mật khẩu phải từ 6 đến 32 ký tự.' })
    @ApiProperty()
    mat_khau?: string;

    @IsNotEmpty({ message: 'Địa chỉ không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    dia_chi?: string;

    @IsNotEmpty({ message: 'Phường ID không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    phuong_id?: string;

    @IsNotEmpty({ message: 'Quận ID không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    quan_id?: string;

    @IsNotEmpty({ message: 'Tỉnh thành không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    tinh_thanh_id?: string;

    @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống !' })
    @IsString()
    @Length(10, 10, { message: 'Số điện thoại phải có độ dài là 10 ký tự' })
    @ApiProperty()
    so_dien_thoai?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    gioi_tinh?: string;
}
