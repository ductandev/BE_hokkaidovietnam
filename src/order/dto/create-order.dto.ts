import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty({ message: 'Email không được bỏ trống !' })
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Họ tên không được bỏ trống !' })
    @IsString()
    @Matches(/^[a-zA-Z\s áàảạãăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ ÁÀẢẠÃĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]+$/, { message: 'Họ tên chỉ được chứa ký tự chữ cái và khoảng trắng' })
    @ApiProperty()
    ho_ten: string;

    @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống !' })
    @IsString()
    @Length(10, 10, { message: 'Số điện thoại phải có độ dài là 10 ký tự' })
    @ApiProperty()
    so_dien_thoai: string;

    @IsNotEmpty({ message: 'Địa chỉ không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    dia_chi: string;

    @IsNotEmpty({ message: 'Phường ID không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    phuong_id: number;

    @IsNotEmpty({ message: 'Quận ID không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    quan_id: number;

    @IsNotEmpty({ message: 'Tỉnh thành không được bỏ trống !' })
    @IsString()
    @ApiProperty()
    tinh_thanh_id: number;

    @ApiProperty()
    giao_dia_chi_khac: boolean

    @ApiProperty()
    ghi_chu: string

    @ApiProperty()
    hinh_thuc_thanh_toan_id: number

    @ApiProperty()
    san_pham: any[]

    @ApiProperty()
    tong_tien: number

    @ApiProperty()
    ma_giam_gia: string

    @ApiProperty()
    thoi_gian_dat_hang: Date

    // @ApiProperty()
    // trang_thai_don_hang_id: number
}
