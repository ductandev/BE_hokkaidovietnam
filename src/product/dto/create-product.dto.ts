import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty()
    loai_san_pham_id?: number
    @ApiProperty()
    ten_san_pham?: string
    @ApiProperty()
    gia_ban?: number
    @ApiProperty()
    gia_giam?: number
    @ApiProperty()
    mo_ta_chi_tiet?: string
    @ApiProperty()
    don_vi_tinh?: string
    @ApiProperty()
    trang_thai_san_pham?: boolean
    @ApiProperty()
    so_luong_trong_kho?: number

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    hinhAnh?: any[];
}
