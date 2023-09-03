import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const canMatchPublicGuard: CanMatchFn = (route: Route,  segments: UrlSegment[]) => {
  return checkAuthStatus();
}

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => {
        if (isAuthenticated)
          router.navigate(['/']);    //si el usuario esta logueado -> mostrar el listado de heroes -> no login page
      }),
      map( isAuthenticated => isAuthenticated = true )
    );
}
