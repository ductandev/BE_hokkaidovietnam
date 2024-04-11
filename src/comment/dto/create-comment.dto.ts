import { ApiProperty } from "@nestjs/swagger"

export class CreateCommentDto {
    @ApiProperty()
    san_pham_id: number
    @ApiProperty()
    nguoi_dung_id: number
    @ApiProperty()
    ngay_binh_luan: Date
    @ApiProperty()
    noi_dung: string
    @ApiProperty()
    sao_binh_luan: number

}
