import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators'

import { Abp } from '@core/abp/Abp';
import { AccountServiceProxy, IsTenantAvailableInput, IsTenantAvailableOutputState } from '@core/abp/service-proxies/service-proxies';


import { MessageService } from '@core/abp/message/message.service';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    templateUrl: './tenant-change-modal.component.html'
})
export class TenantChangeModalComponent implements OnInit {

    @Input() tenancyName: string;
    saving = false;

    constructor(
        private modal: NzModalRef,
        private accountService: AccountServiceProxy,
        private messageService: MessageService,
        private i18NService: I18NService
    ) {
    }

    ngOnInit() {
    }

    submit(): void {

        if (!this.tenancyName) {

            Abp.multiTenancy.setTenantIdCookie(undefined);
            this.close();
            return;
        }

        const input = new IsTenantAvailableInput();
        input.tenancyName = this.tenancyName;

        this.saving = true;
        this.accountService.isTenantAvailable(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                switch (result.state) {
                    case AppTenantAvailabilityState.Available:
                        Abp.multiTenancy.setTenantIdCookie(result.tenantId);
                        this.close();
                        return;
                    case AppTenantAvailabilityState.InActive:
                        this.messageService.warn(this.i18NService.localize('TenantIsNotActive', this.tenancyName));
                        break;
                    case AppTenantAvailabilityState.NotFound:
                        this.messageService.warn(this.i18NService.localize('ThereIsNoTenantDefinedWithName{0}', this.tenancyName));    //abp默认代码中就多一个{0}，手动改一下xml文件后再改这里
                        break;
                }
            });
    }

    close(): void {
        this.modal.close();
    }
}

class AppTenantAvailabilityState {
    static Available: number = IsTenantAvailableOutputState._1;
    static InActive: number = IsTenantAvailableOutputState._2;
    static NotFound: number = IsTenantAvailableOutputState._3;
}