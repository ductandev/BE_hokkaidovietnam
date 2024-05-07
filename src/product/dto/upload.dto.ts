import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto_product {

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    hinh_anh?: any[];
}                   
