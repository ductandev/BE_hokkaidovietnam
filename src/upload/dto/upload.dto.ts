import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto_upload {

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    hinh_anh?: any[];
}                   
