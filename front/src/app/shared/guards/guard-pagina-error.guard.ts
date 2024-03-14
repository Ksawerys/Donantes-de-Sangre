import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardPaginaErrorGuard implements CanActivate {
  private lastNavigationOriginatedInternally = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationStart => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      this.lastNavigationOriginatedInternally = event.navigationTrigger === 'imperative';
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
    if (this.lastNavigationOriginatedInternally || state.url !== '/error') {
      return true;
    } else {
      this.router.navigate(['/inicio']);
      return false;
    }
  }
}