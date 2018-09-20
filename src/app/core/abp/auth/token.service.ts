import { Inject, Injectable } from '@angular/core';
import { Abp } from '../Abp';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable()
export class TokenService {

    constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService){}

    getToken(): string {
        let token = this.tokenService.get();
        return token ? token.token : undefined;
    }

    getTokenCookieName(): string {
        return Abp.auth.tokenCookieName;
    }

    clearToken(): void {
        this.tokenService.clear();
    }

    setToken(authToken: string, expireDate?: Date): void {
        this.tokenService.set({
            token: authToken,
            expireDate: expireDate
        });
    }

    get loginUrl(){
        return this.tokenService.login_url;
    }

}
