import { Component, Input } from '@angular/core';
import { TenantServiceProxy, TenantDto } from '@core/abp/service-proxies/service-proxies';
import { finalize } from "rxjs/operators";
import { NotifyService } from '@core/abp/notify/notify.service';
import { NzModalRef } from 'ng-zorro-antd';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    templateUrl: './edit-tenant.component.html'
})
export class EditTenantComponent {
    @Input() id: number;
    tenant: TenantDto = null;
    saving: boolean = false;

    constructor(
        private modal: NzModalRef,
        private i18NService: I18NService,
        private tenantServiceProxy: TenantServiceProxy,
        private notifyService: NotifyService
    ) {
    }


    ngOnInit() {
        this.saving = true;
        this.tenantServiceProxy.get(this.id)
        .pipe(finalize(() => { this.saving = false }))
        .subscribe(result => {
            this.tenant = result;
        });
    }

    save(): void {
        this.saving = true;

        this.tenantServiceProxy.update(this.tenant)
        .pipe(finalize(() => { this.saving = false }))
        .subscribe(() => {
            this.notifyService.success(this.i18NService.localize('SavedSuccessfully'));
            this.modal.close(true);
        });
    }

    close(): void {
        this.modal.close();
    }
}

