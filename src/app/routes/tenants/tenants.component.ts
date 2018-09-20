
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@core/abp/components';
import { TenantServiceProxy, TenantDto } from '@core/abp/service-proxies/service-proxies';
import { ModalHelper } from '@delon/theme';

import { CreateTenantComponent } from './create-tenant/create-tenant.component';
import { EditTenantComponent } from './edit-tenant/edit-tenant.component';

@Component({
    templateUrl: './tenants.component.html'
})
export class TenantsComponent extends PagedListingComponentBase<TenantDto> {

    constructor(
        private modalHelper: ModalHelper,
        private tenantService: TenantServiceProxy
    ) {
        super();
    }

    protected list(request: PagedRequestDto, pageNumber: number): Observable<PagedResultDto> {
        return this.tenantService.getAll(request.skipCount, request.maxResultCount);
    }

    protected delete(item: TenantDto): void {
        this.tenantService.delete(item.id).subscribe(()=> {this.refresh();});
    }

    create(): void {
        this.modalHelper.open(CreateTenantComponent, undefined, 'md', { nzMask: true }).subscribe(result => {
            if(result){
                this.refresh();
            }
        });
    }

    edit(item: TenantDto): void {
        this.modalHelper.open(EditTenantComponent, { id: item.id }, 'md', { nzMask: true }).subscribe(result => {
            if(result){
                this.refresh();
            }
        });
    }
}
