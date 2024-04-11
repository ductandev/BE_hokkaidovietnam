import { ApiProperty } from "@nestjs/swagger";

export class UserSignInDto {
    @ApiProperty()
    email: string
    @ApiProperty()
    mat_khau: string
}
