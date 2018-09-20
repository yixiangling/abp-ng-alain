import { AppConsts } from './AppConsts';
import { HttpClient } from '@angular/common/http';

import { Abp } from './Abp';
import { AbpConfigurationService } from './abp-configuration.service'

export class AppPreBootstrap {

    constructor(
        private httpClient: HttpClient,
        private abpConfigurationService: AbpConfigurationService
    ) { }

    public run(resolve: () => void, reject: () => void): void {
        this.getApplicationConfig(() => {
            this.abpConfigurationService.reload().then(() => {
                resolve();
            }).catch(() => {
                reject();
            })
        });
    }

    private getApplicationConfig(callback: () => void) {

        let requestHeaders = {};
        if (Abp.multiTenancy.getTenantIdCookie()) {
            requestHeaders['Abp.TenantId'] = Abp.multiTenancy.getTenantIdCookie().toString();
        }

        this.httpClient.get<any>('/assets/appconfig.json', {
            headers: requestHeaders
        }).subscribe(result => {
            AppConsts.appBaseUrl = result.appBaseUrl;
            AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl;

            callback();
        });
    }
}