import { Injectable } from '@angular/core';

import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
import { TokenService } from './token.service';

@Injectable()
export class SessionRouteGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private tokenService: TokenService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.tokenService.getToken()) {
            this.router.navigate([this.tokenService.loginUrl]);
            return false;
        }else{
            return true;
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
}