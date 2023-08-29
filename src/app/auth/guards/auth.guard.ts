import { CanMatchFn, Route, UrlSegment, ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

export const canMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  console.log("canmatch");
  console.log({route, segments});

  return false;
}

export const canActivatedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log("canactivated");
  console.log({route, state});

  return false;
}
