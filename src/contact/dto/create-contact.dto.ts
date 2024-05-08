import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateContactDto {
    @IsNotEmpty({ message: "Họ tên không được bỏ trống" })
    @IsString()
    @Matches(/^[a-zA-Z\s áàảạãăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ ÁÀẢẠÃĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]+$/, { message: 'Họ tên chỉ được chứa ký tự chữ cái và khoảng trắng' })
    @ApiProperty()
    ho_ten: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @ApiProperty()
    noi_dung: string

}
