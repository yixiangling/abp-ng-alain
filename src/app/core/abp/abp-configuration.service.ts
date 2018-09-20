import { Injectable, Injector, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppConsts } from '@core/abp/AppConsts';
import { Abp, abp } from '@core/abp/Abp';

import { TokenService } from '@core/abp/auth/token.service'

import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '@core/i18n/i18n.service';
import { AbpMultiTenancyService } from '@core/abp/multi-tenancy/abp-multi-tenancy.service';
import { AbpTranslateHttpLoader } from '@core/abp/localization/AbpTranslateLoader';

@Injectable()
export class AbpConfigurationService {
    constructor(
        private menuService: MenuService,
        private abpMultiTenancyService: AbpMultiTenancyService,
        private translate: TranslateService,
        @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
        private settingService: SettingsService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private tokenService: TokenService,
        private aclService: ACLService
    ) { }

    reload(): Promise<void> {
        return new Promise<void>((resolve, reject)=>{
            this.getUserConfiguration(resolve, reject);
        });
    }

    private getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
        if (currentProviderName === "unspecifiedClockProvider") {
            return Abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === "utcClockProvider") {
            return Abp.timing.utcClockProvider;
        }

        return Abp.timing.localClockProvider;
    }

    private getUserConfiguration(resolve: () => void, reject: () => void) {
        this.translate.setDefaultLang(this.i18n.currentLang);
        
        let requestHeaders = {
            Authorization: 'Bearer ' + this.tokenService.getToken(),
            '.AspNetCore.Culture': this.i18n.currentLang
        };
        if (Abp.multiTenancy.getTenantIdCookie()) {
            requestHeaders['Abp.TenantId'] = Abp.multiTenancy.getTenantIdCookie();
        }

        let languageLoader = new AbpTranslateHttpLoader(this.httpClient);

        zip(
            this.httpClient.get<any>(AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll', { headers: requestHeaders }),
            languageLoader.getTranslation(this.i18n.currentLang),
            this.httpClient.get<any>('/assets/menu.json')   //客户端定义导航菜单暂时写在这里，如果你的导航是在服务器端定义的那么去掉此项直接从/AbpUserConfiguration/GetAll返回的nav中获取
        ).subscribe(([configData, langData, menuData]) => {
            this.setConfigData(configData.result);
            this.translate.setTranslation(this.i18n.currentLang, langData);
            
            // 初始化菜单
            this.menuService.clear();
            this.menuService.add(menuData);

            resolve();
        });
    }

    private setConfigData(result){
        Abp.multiTenancy.setGlobal(result.multiTenancy);
        Abp.session.setGlobal(result.session);
        Abp.features.setGlobal(result.features);
        //Abp.localization.setGlobal(result.localization);
        Abp.auth.setGlobal(result.auth);
        Abp.nav.setGlobal(result.nav);
        Abp.setting.setGlobal(result.setting);

        Abp.clock.setGloabl(result.clock);
        Abp.timing.setGloabl(result.timing);

        Abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);

        //ng-alain 部分
        // 应用信息：包括站点名、描述、年份
        this.settingService.setApp(AppConsts.app);
        // 用户信息：包括姓名、头像、邮箱地址
        // this.settingService.setUser(res.user);   //在AbpSessionService服务中调用refresh设置，GetAll方法并没有返回该数据，也可以自行修改后在此获取
        // ACL：设置
        this.aclService.setFull(false);
        this.aclService.setRole(this.getRoles(result.auth.grantedPermissions));
        
        // 设置页面标题的后缀
        this.titleService.suffix = AppConsts.app.name;

        
    }

    private getRoles(grantedPermissions): string[] {
        let roles = [];
        for (const key in grantedPermissions) {
            if (grantedPermissions.hasOwnProperty(key)) {
                const value = grantedPermissions[key];
                if (value.toString().toLowerCase() == 'true') {
                    roles.push(key);
                }
            }
        }
        return roles;
    }

}
