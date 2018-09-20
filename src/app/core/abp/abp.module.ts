import { NgModule, Injector, LOCALE_ID, ModuleWithProviders } from '@angular/core';
import { HttpModule, JsonpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from './message/message.service';
import { NotifyService } from './notify/notify.service';
import { LogService } from './log/log.service';
import { UtilsService } from './utils/utils.service';
import { TokenService } from './auth/token.service';
import { SessionRouteGuard } from './auth/auth-route-guard';
import { AbpSessionService } from './session/abp-session.service';
import { AbpMultiTenancyService } from './multi-tenancy/abp-multi-tenancy.service';
import { SettingService } from './settings/setting.service';
import { FeatureCheckerService } from './features/feature-checker.service';

import { TranslateFormatPipe } from './localization/translateFormat.pipe'

import { AbpHttpConfiguration, AbpHttp } from './abpHttp';

import { Abp } from '@core/abp/Abp';
import { AppConsts } from '@core/abp/AppConsts';
import { API_BASE_URL } from '@core/abp/service-proxies/service-proxies';
import { ServiceProxyModule } from '@core/abp/service-proxies/service-proxy.module';

import { AbpConfigurationService } from '@core/abp/abp-configuration.service'
// import { I18NService } from '@core/i18n/i18n.service';

const PIPES = [TranslateFormatPipe];

const ABP_SERVICES = [
    MessageService,
    NotifyService,
    LogService,
    UtilsService,
    TokenService,
    AbpSessionService,
    AbpMultiTenancyService,
    SettingService,
    FeatureCheckerService,
    SessionRouteGuard,
    AbpConfigurationService
]

export function abpHttpFactory(
    xhrBackend: XHRBackend,
    requestOptions: RequestOptions,
    configuration: AbpHttpConfiguration,
    tokenService: TokenService): Http {
    return new AbpHttp(xhrBackend, requestOptions, configuration, tokenService);
}

let ABP_HTTP_PROVIDER = {
    provide: Http,
    useFactory: abpHttpFactory,
    deps: [XHRBackend, RequestOptions, AbpHttpConfiguration, TokenService]
};

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
    return Abp.localization.currentLanguage.name;
}

const ABP_PROVIDERS = [
    ABP_HTTP_PROVIDER,
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    {
        provide: LOCALE_ID,
        useFactory: getCurrentLanguage
    }
]

@NgModule({
    imports: [
        HttpModule,
        JsonpModule,
        ServiceProxyModule
    ],

    declarations: [
        ...PIPES
    ],

    providers: [
        AbpHttpConfiguration,
        CookieService,
        ...ABP_PROVIDERS,
        // ...ABP_SERVICES
    ],
    exports: [
        ServiceProxyModule,
        ...PIPES
    ],
})
export class AbpModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AbpModule,
            providers: [
                ...ABP_PROVIDERS,
                ...ABP_SERVICES
            ]
        };
    }
}
