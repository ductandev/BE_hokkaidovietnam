import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductDto {
    @ApiProperty()
    loai_san_pham_id?: number

    @ApiProperty()
    ten_san_pham?: string

    @ApiProperty()
    gia_ban?: number

    @ApiProperty()
    gia_giam?: number

    @ApiProperty()
    mo_ta?: string

    @ApiProperty()
    thong_tin_chi_tiet?: string

    @ApiProperty()
    don_vi_tinh?: string

    @ApiProperty()
    trang_thai_san_pham?: boolean

    @ApiProperty()
    so_luong_trong_kho?: number

    @ApiProperty()
    san_pham_noi_bat?: boolean

    @ApiProperty()
    san_pham_lien_quan?: []
}