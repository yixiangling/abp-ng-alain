import { Component, OnInit, Injector, ViewChild } from '@angular/core';

import { ModalHelper } from '@delon/theme';

import { TenantChangeModalComponent } from './tenant-change-modal.component';
import { AbpSessionService } from '@core/abp/session/abp-session.service'
import { MessageService } from '@core/abp/message/message.service';

import { Abp } from '@core/abp/Abp';

@Component({
    selector: 'tenant-change',
    template:
        `<p *ngIf="isMultiTenancyEnabled"> 
            <span *ngIf="tenancyName" title="{{name}}">{{ 'TenancyName' | translate }}: <strong>{{tenancyName}}</strong></span> 
            <span *ngIf="!tenancyName">{{ 'CanBeEmptyToLoginAsHost' | translate }}</span> 
            (<a href="javascript:;" (click)="showChangeModal()">{{ 'Change' | translate }}</a>)
        </p>`
})
export class TenantChangeComponent implements OnInit {

    tenancyName: string;
    name: string;

    constructor(
        private modalHelper: ModalHelper,
        private abpSessionService: AbpSessionService,
        private messageService: MessageService,
    ) {
    }

    ngOnInit() {
        this.readTenantInfo();
    }

    private readTenantInfo() {
        this.abpSessionService.refresh().then(() => {
            this.tenancyName = this.abpSessionService.tenancyName;
            this.name = this.abpSessionService.tenantName;
        }).catch(() => {
            this.messageService.error('操作失败，请重试！');
        })
    }

    get isMultiTenancyEnabled(): boolean {

        return Abp.multiTenancy.isEnabled;
    }

    showChangeModal(): void {
        this.modalHelper.open(TenantChangeModalComponent, { tenancyName: this.tenancyName }, 'md', { nzMask: true }).subscribe(result => {
            this.readTenantInfo();
        });
    }
}
