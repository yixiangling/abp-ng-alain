import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { finalize, catchError } from"rxjs/operators";

import { TokenAuthServiceProxy, AuthenticateModel, AuthenticateResultModel, ExternalLoginProviderInfoModel, ExternalAuthenticateModel, ExternalAuthenticateResultModel } from '@core/abp/service-proxies/service-proxies';

import { MessageService } from '@core/abp/message/message.service';
import { TokenService } from '@core/abp/auth/token.service';
import { AbpSessionService } from '@core/abp/session/abp-session.service';
import { AbpConfigurationService } from '@core/abp/abp-configuration.service';

@Injectable()
export class LoginService {

    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';

    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;

    rememberMe: boolean;

    constructor(
        private tokenAuthService: TokenAuthServiceProxy,
        private router: Router,
        private messageService: MessageService,
        private tokenService: TokenService,
    private abpConfigurationService: AbpConfigurationService,
    private abpSessionService: AbpSessionService
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

        this.tokenAuthService
            .authenticate(this.authenticateModel)
            .pipe(finalize(()=> {finallyCallback();}), catchError(error=>{ return error; }))
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result);
            });
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.accessToken) {
            //Successfully logged in
            this.login(authenticateResult.accessToken, authenticateResult.encryptedAccessToken, authenticateResult.expireInSeconds, this.rememberMe);
            this.clear();

        } else {
            //Unexpected result!
            this.messageService.warn('Unexpected authenticateResult!');
        }
    }

    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean): void {

        var tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        this.tokenService.setToken(
            accessToken,
            tokenExpireDate
        );
        
        this.abpConfigurationService.reload().then(()=>{
            this.abpSessionService.refresh().then(()=>{
                this.router.navigate(['/']);
            });
        })
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }
}
