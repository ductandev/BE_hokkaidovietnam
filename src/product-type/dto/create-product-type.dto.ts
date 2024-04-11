import { ApiProperty } from "@nestjs/swagger";

export class CreateProductTypeDto {
    @ApiProperty()
    ten_loai_san_pham: string
}
