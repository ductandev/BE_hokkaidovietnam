import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {   //(Strategy,"jwt-abc") Tham số thứ 2: tên key muốn đổi, mặc định sẽ là jwt

    // Kết hợp với middleware Guard, tự động kiểm tra token
    // Bearer token
    constructor(config: ConfigService) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "NODE",        // Key bí mật
        });
    }


    // Dưới đây là muốn custom để check quyền cho đi tiếp
    async validate(tokenDecode: any) {          //  tokenDecode: token đã được giải mã


        return tokenDecode;
    }
}
