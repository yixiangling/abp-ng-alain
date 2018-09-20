import { Injectable } from '@angular/core';

import { Abp } from '../Abp';
import { SessionServiceProxy, UserLoginInfoDto, TenantLoginInfoDto, GetCurrentLoginInformationsOutput } from '@core/abp/service-proxies/service-proxies';
import { SettingsService } from '@delon/theme';
import { TokenService } from '@core/abp/auth/token.service';


@Injectable()
export class AbpSessionService {

    private currentUser: UserLoginInfoDto = undefined;
    private currentTenant: TenantLoginInfoDto = undefined;

    constructor(
        private sessionServiceProxy: SessionServiceProxy,
        private settingsService: SettingsService,
        private tokenService: TokenService
    ){}

    get userId(): number | undefined {
        return Abp.session.userId;
    }

    get userName(): string {
        return this.currentUser ? (this.currentUser.name + this.currentUser.surname) : '';
    }

    get tenantId(): number | undefined {
        return Abp.session.tenantId;
    }

    get tenantName(): string | undefined {
        return this.currentTenant ? this.currentTenant.name : '';
    }

    get tenancyName(): string {
        return this.currentTenant ? this.currentTenant.tenancyName : '';
    }

    refresh(): Promise<void>{
        return new Promise<void>((resolve, reject)=>{
            this.sessionServiceProxy.getCurrentLoginInformations().toPromise().then((res: GetCurrentLoginInformationsOutput) =>{
                this.currentUser = res.user;
                this.currentTenant = res.tenant;

                if(res.user)
                {
                    Abp.session.userId = res.user.id;
                    this.settingsService.setUser({
                        name: this.userName,
                        avatar: './assets/tmp/img/avatar.jpg',
                        email: res.user.emailAddress
                    });
                }else{
                    this.settingsService.setUser(null);
                    //location.href = this.tokenService.loginUrl;
                }
                if(res.tenant)
                    Abp.session.tenantId = res.tenant.id;
                resolve();
            }, res => {
                this.currentUser = undefined;
                this.currentTenant = undefined;
                Abp.session.userId = undefined;
                Abp.session.tenantId = undefined;
                reject();
            });
        });
    }
}
