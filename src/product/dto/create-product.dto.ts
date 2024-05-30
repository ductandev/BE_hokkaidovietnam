import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    // [x: string]: any;
    @IsNotEmpty({ message: "Loại sản phẩm ID không được bỏ trống !" })
    @ApiProperty({ type: 'number' })
    loai_san_pham_id?: number

    @IsNotEmpty({ message: "Tên sản phẩm không được bỏ trống !" })
    @ApiProperty()
    ten_san_pham?: string

    @ApiProperty({ type: 'number' })
    gia_ban?: number

    @ApiProperty({ type: 'number' })
    gia_giam?: number

    @ApiProperty()
    mo_ta?: string

    @ApiProperty()
    thong_tin_chi_tiet?: string

    @ApiProperty({ type: 'string', required: false })
    don_vi_tinh?: string

    @ApiProperty({ type: 'boolean', required: false })
    trang_thai_san_pham?: boolean

    @ApiProperty({ type: 'number' })
    so_luong_trong_kho?: number

    @ApiProperty({ type: 'boolean', required: false })
    san_pham_noi_bat?: boolean

    @ApiProperty({ type: 'array', required: false })
    san_pham_lien_quan?: any[]



    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    hinh_anh?: any[];
}
