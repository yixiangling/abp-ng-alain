import { Component, OnInit } from '@angular/core';
import { RoleServiceProxy, ListResultDtoOfPermissionDto, CreateRoleDto } from '@core/abp/service-proxies/service-proxies';
import { finalize } from "rxjs/operators";
import { NotifyService } from '@core/abp/notify/notify.service';
import { NzModalRef } from 'ng-zorro-antd';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    templateUrl: './create-role.component.html'
})
export class CreateRoleComponent implements OnInit {

    saving = false;
    permissions: ListResultDtoOfPermissionDto = null;
    model: CreateRoleDto = new CreateRoleDto();
    permissionList = [];

    constructor(
        private modal: NzModalRef,
        private i18NService: I18NService,
        private roleService: RoleServiceProxy,
        private notifyService: NotifyService
    ) {
    }

    ngOnInit() {
        this.saving = true;

        this.roleService.getAllPermissions()
            .pipe(finalize(()=>{this.saving = false}))
            .subscribe((permissions: ListResultDtoOfPermissionDto) => {
                this.permissions = permissions;

                this.permissions.items.forEach((item) => {
                    this.permissionList.push({
                        label: item.displayName, value: item.name, checked: true
                    });
                });

            });
    }

    save(): void {
        this.saving = true;
        let tmpPermissions = [];

        this.permissionList.forEach((item) => {
            if (item.checked) {
                tmpPermissions.push(item.value);
            }
        });

        this.model.permissions = tmpPermissions;

        this.roleService.create(this.model)
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
