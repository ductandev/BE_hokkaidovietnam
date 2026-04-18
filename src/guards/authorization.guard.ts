import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../user/entities/role.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log("🚀 Role cần để mở API", requiredRoles)

    // Nếu API nào  ko sử dụng roles thì cứ để nó đi qua
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.user.data;
    // .includes(): kiểm tra xem một giá trị cụ thể có tồn tại trong mảng hay không.
    //  Nếu tồn tại, nó trả về true, ngược lại, nó trả về false.
    return requiredRoles.includes(userRole.vai_tro_id);
  }
}
