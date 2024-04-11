import { ApiProperty } from "@nestjs/swagger"

export class UserSignUpType {
    // @ApiProperty()
    nguoi_dung_id: number
    // @ApiProperty()
    vai_tro_id: number
    @ApiProperty()
    ho_ten: string
    @ApiProperty()
    email: string
    @ApiProperty()
    mat_khau: string
    @ApiProperty()
    so_dien_thoai: string
    @ApiProperty()
    anh_dai_dien: string
    @ApiProperty()
    gioi_tinh: string
    // @ApiProperty()
    isDelete: boolean
}