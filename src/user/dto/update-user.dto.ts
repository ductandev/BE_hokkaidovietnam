import { ApiProperty } from "@nestjs/swagger"

export class UserUpdateDto {
    @ApiProperty()
    ho_ten:string
    @ApiProperty()
    email:string
    @ApiProperty()
    mat_khau:string
    @ApiProperty()
    so_dien_thoai:string
    @ApiProperty()
    ngay_sinh:string
    @ApiProperty()
    gioi_tinh:string
    @ApiProperty()
    tuoi: number
}