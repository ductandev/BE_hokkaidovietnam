import { ApiProperty } from "@nestjs/swagger"

export class CreateDiscountDto {
    @ApiProperty()
    ma_giam_gia: string
    @ApiProperty()
    noi_dung: string
    @ApiProperty()
    ap_dung_cho: string
    @ApiProperty()
    loai: string
    @ApiProperty({ type: 'number' })
    cu_the: number
    @ApiProperty({ type: 'number' })
    gia_tri_giam: number
    @ApiProperty()
    ngay_het_han: Date
}

export class NameDiscountDto {
    @ApiProperty()
    ma_giam_gia: string
}