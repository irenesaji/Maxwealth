import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const tokenArray = req.headers.authorization;
    // console.log("Halelujah",tokenArray);
    // console.log("authService",this.authService);

    if (tokenArray) {
      req.headers['user'] = this.authService.decodeToken(
        tokenArray.split(' ')[1],
      ).user;
    }

    return next
      .handle()
      .pipe
      // tap(() => console.log(``)),
      ();
  }
}
