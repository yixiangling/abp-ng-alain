import { Injectable } from '@angular/core';

import { Abp } from '../Abp';

@Injectable()
export class AbpMultiTenancyService {

    get isEnabled(): boolean {
        return Abp.multiTenancy.isEnabled;
    }

    get tenantId(): number | undefined {
        return Abp.session.tenantId;
    }

}
