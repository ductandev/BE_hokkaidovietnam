import { ApiProperty } from "@nestjs/swagger"

export class CreateNewsDto {
    @ApiProperty()
    tieu_de?: string

    @ApiProperty()
    mo_ta?: string

    @ApiProperty()
    noi_dung?: string

    @ApiProperty({ type: 'string', format: 'binary' })
    hinh_anh?: string

    @ApiProperty()
    bai_viet_lien_quan?: any[]
}
