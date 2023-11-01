import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector :Reflector){
        super();
    
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);
      const allowedRoles = this.reflector.getAllAndOverride<string[]>('role-path', [context.getHandler(), context.getClass()]);
      if (isPublic) return true;

      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      console.log(user);
      
      if (!allowedRoles) {
          return true;
      }

      if (!user) {
          return false;
      }

      if (!allowedRoles.includes(user?.role)) {
          return false;
      }

      return true;
  }
}