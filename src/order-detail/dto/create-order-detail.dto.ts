import { ApiProperty } from "@nestjs/swagger"

export class CreateOrderDetailDto {
    @ApiProperty()
    don_hang_id: number
    @ApiProperty()
    san_pham_id: number
    @ApiProperty()
    so_luong: number
    @ApiProperty()
    don_gia: number
    @ApiProperty()
    thanh_tien: number
    @ApiProperty()
    ma_giam: string
}
