import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, Length, Matches, IsOptional, IsNotEmpty } from 'class-validator';


export class UserUpdateDto {
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z\s áàảạãăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ ÁÀẢẠÃĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]+$/, { message: 'Họ tên chỉ được chứa ký tự chữ cái và khoảng trắng' })
    @ApiProperty({ type: 'string', required: false })
    ho_ten?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ type: 'string' })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(6, 32, { message: 'Mật khẩu phải từ 6 đến 32 ký tự.' })
    @ApiProperty({ type: 'string' })
    mat_khau?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string' })
    dia_chi?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string' })
    phuong_id?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string' })
    quan_id?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string' })
    tinh_thanh_id?: string;

    @IsString()
    @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống !' })
    @Length(10, 10, { message: 'Số điện thoại phải có độ dài là 10 ký tự' })
    @ApiProperty({ type: 'string' })
    so_dien_thoai?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string' })
    gioi_tinh?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string' })
    anh_dai_dien?: string;
}