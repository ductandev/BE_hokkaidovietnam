import { ApiProperty } from "@nestjs/swagger"

export class CreateOrderDto {
    @ApiProperty()
    so_phieu: string
    @ApiProperty()
    nguoi_dung_id: number
    @ApiProperty()
    thoi_gian_dat_hang: Date
    @ApiProperty()
    thoi_gian_giao_hang: Date
    @ApiProperty()
    trang_thai_dat_hang: boolean
}
