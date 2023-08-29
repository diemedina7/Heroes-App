import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const canMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  console.log("canmatch");
  console.log({route, segments});

  return checkAuthStatus();
}

export const canActivatedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log("canactivated");
  console.log({route, state});

  return checkAuthStatus();
}

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => {
        if (!isAuthenticated)
          router.navigate(['./auth/login']);    //si el usuario no es válido -> redireccionar al login
      })
    );
}
