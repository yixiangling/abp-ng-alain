import { Component, Input, OnInit } from '@angular/core';
import { RoleServiceProxy, RoleDto, ListResultDtoOfPermissionDto } from '@core/abp/service-proxies/service-proxies';
import { zip } from 'rxjs';
import { finalize, catchError } from "rxjs/operators";
import { NotifyService } from '@core/abp/notify/notify.service';
import { NzModalRef } from 'ng-zorro-antd';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    templateUrl: './edit-role.component.html'
})
export class EditRoleComponent implements OnInit {

    @Input() id: number;
    permissions: ListResultDtoOfPermissionDto = null;
    role: RoleDto = null;

    permissionList = [];
    saving: boolean = false;


    constructor(
        private modal: NzModalRef,
        private i18NService: I18NService,
        private roleService: RoleServiceProxy,
        private notifyService: NotifyService
    ) {
    }

    ngOnInit() {
        this.saving = true;

        zip(
            this.roleService.getAllPermissions(),
            this.roleService.get(this.id)
        ).pipe(
            catchError(([permissions, role]) => {
                this.notifyService.error(this.i18NService.localize('LoadingFailedTryAgain'));
                return [permissions, role];
            }),
            finalize(() => this.saving = false)
        ).subscribe(
            ([permissions, role]) => {
                this.permissions = permissions;
                this.role = role;
                this.permissions.items.forEach((item) => {
                    this.permissionList.push({
                        label: item.displayName, value: item.name, checked: this.checkPermission(item.name), disabled: this.role.isStatic
                    });
                });
            }
        )
    }

    checkPermission(permissionName: string): boolean {
        return this.role.permissions.indexOf(permissionName) != -1;
    }

    save(): void {
        this.saving = true;
        let tmpPermissions = [];

        this.permissionList.forEach((item) => {
            if (item.checked) {
                tmpPermissions.push(item.value);
            }
        });

        this.role.permissions = tmpPermissions;

        this.roleService.update(this.role)
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
