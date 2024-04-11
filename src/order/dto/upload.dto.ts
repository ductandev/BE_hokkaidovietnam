import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    hinhAnh: any // phải đúng với key khai báo tham số 1 bên FileInterceptor
}