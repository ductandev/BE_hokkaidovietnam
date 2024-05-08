import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateContactDto extends PartialType(CreateContactDto) {
    @IsNotEmpty({ message: "Trạng thái liên hệ không được bỏ trống" })
    @IsNumber()
    trang_thai_lien_he_id: number
}
