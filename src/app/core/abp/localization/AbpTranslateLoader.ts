import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { AppConsts } from '../AppConsts';
import { Abp } from '../Abp';


export class AbpTranslateHttpLoader implements TranslateLoader {
    constructor(
        private http: HttpClient
    ) { }

    public getTranslation(lang: string): Observable<Object> {
        //这个函数应该调用独立的多语言服务，因默认模板没有，因此此处调用GetAll，来获取多语言动态切换支持

        Abp.utils.setCookieValue(
            "Abp.Localization.CultureName",
            lang,
            new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
            Abp.appPath, undefined
        );

        let requestHeaders: any = {
            '.AspNetCore.Culture': lang
        };
        if(Abp.multiTenancy.getTenantIdCookie())
            requestHeaders['Abp.TenantId'] = Abp.multiTenancy.getTenantIdCookie().toString();

        return this.http.get<any>(AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll', {
            headers: requestHeaders
        }).pipe(map((response: any) => this.mergeLocalizationSource(response)));
    }

    private mergeLocalizationSource(response) {
        let localization = response.result.localization;
        let sources = localization.sources;
        let values = localization.values;

        //ng-alain多语言不支持多个source处理，此处将abp的多个source合并为一个语言字典
        let langData = {};
        sources.forEach(item => {
            let value = values[item.name];
            for (var property in value) {
                langData[property] = value[property];
            }
        });

        return langData;
    }
}