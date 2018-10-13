import { Injectable, Injector } from '@angular/core';

import { AppConsts } from './AppConsts';
import { HttpClient } from '@angular/common/http';

import { Abp } from './Abp';
import { AbpConfigurationService } from './abp-configuration.service'
import { AbpSessionService } from './session/abp-session.service';

@Injectable()
export class AppPreBootstrap {

    constructor(
        private injector: Injector
    ) { }

    public run(resolve: () => void, reject: () => void): void {
        this.getApplicationConfig((appconfig) => {
            AppConsts.appBaseUrl = appconfig.appBaseUrl;
            AppConsts.remoteServiceBaseUrl = appconfig.remoteServiceBaseUrl;

            const abpConfigurationService = this.injector.get(AbpConfigurationService);
            const abpSessionService = this.injector.get(AbpSessionService);

            Promise.all([
                abpConfigurationService.reload(),
                abpSessionService.refresh(),
            ]).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    private getApplicationConfig(callback: (appconfig: any) => void) {

        let requestHeaders = {};
        if (Abp.multiTenancy.getTenantIdCookie()) {
            requestHeaders['Abp.TenantId'] = Abp.multiTenancy.getTenantIdCookie().toString();
        }

        const httpClient = this.injector.get(HttpClient);

        httpClient.get<any>('/assets/appconfig.json', {
            headers: requestHeaders
        }).subscribe(result => {
            callback(result);
        });
    }
}
