import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';


export class UserUpdateDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z\s áàảạãăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ ÁÀẢẠÃĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]+$/, { message: 'Họ tên chỉ được chứa ký tự chữ cái và khoảng trắng' })
    @ApiProperty()
    ho_ten: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 32, { message: 'Mật khẩu phải từ 6 đến 32 ký tự.' })
    @ApiProperty()
    mat_khau: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    dia_chi: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 10, { message: 'Số điện thoại phải có độ dài là 10 ký tự' })
    @ApiProperty()
    so_dien_thoai: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    gioi_tinh: string;
}