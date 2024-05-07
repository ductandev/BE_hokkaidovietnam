import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductTypeDto {
    @IsNotEmpty({ message: "Tên loại sản phẩm không được bỏ trống !" })
    @IsString()
    @ApiProperty()
    ten_loai_san_pham: string
}
