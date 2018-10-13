import { Component, OnInit } from '@angular/core';
import { TenantServiceProxy, CreateTenantDto } from '@core/abp/service-proxies/service-proxies';
import { finalize } from"rxjs/operators";
import { NotifyService } from '@core/abp/notify/notify.service';
import { NzModalRef } from 'ng-zorro-antd';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    templateUrl: './create-tenant.component.html'
})
export class CreateTenantComponent {
    saving = false;
    model: CreateTenantDto = new CreateTenantDto();

    constructor(
        private modal: NzModalRef,
        private i18NService: I18NService,
        private tenantServiceProxy: TenantServiceProxy,
        private notifyService: NotifyService
    ) {
    }

    ngOnInit() {
        this.model.init({ isActive: true });
    }

    save(): void {
        this.saving = true;

        this.tenantServiceProxy.create(this.model)
            .pipe(finalize(()=>{this.saving = false}))
            .subscribe(() => {
                this.notifyService.success(this.i18NService.localize('SavedSuccessfully'));
                this.modal.close(true);
            });
    }

    close(): void {
        this.modal.close();
    }

}
