import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateCartDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: 'number' })
    nguoi_dung_id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: 'number' })
    san_pham_id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: 'number' })
    so_luong: number
}
