import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      // console.log("🚀 ~ REQUEST: ", request)

      // ⭐ LẤY TÁCH TOKEN RA KHỎI CHUỔI
      const token = request.headers.authorization.split(' ')[1];
      // console.log(token);

      if (!token) {
        throw new UnauthorizedException();
      }
      // ⭐ GIẢI MÃ TOKEN RA
      request.user = this.jwtService.verify(token);
      // console.log(request.user)
    } catch (error) {
      console.log(
        '🚀 TOKEN không hợp lệ ~ file: authentication.guard.ts:21 ~ AuthenticationGuard ~ canActivate ~ error:',
        error,
      );
      throw new UnauthorizedException();
    }

    return true;
  }
}
