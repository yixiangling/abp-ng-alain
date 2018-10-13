import { Component, Input, OnInit } from '@angular/core';
import { RoleServiceProxy, GetRoleForEditOutput, ListResultDtoOfPermissionDto, RoleDto } from '@core/abp/service-proxies/service-proxies';
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
    model: GetRoleForEditOutput = null;

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

        this.roleService.getRoleForEdit(this.id).pipe(finalize(() => this.saving = false)).subscribe(result => {
            this.model = result
            result.permissions.forEach((item) => {
                this.permissionList.push({
                    label: item.displayName, value: item.name, checked: this.checkPermission(item.name), disabled: result.role.isStatic
                });
            });
        });
    }

    checkPermission(permissionName: string): boolean {
        return this.model.grantedPermissionNames.indexOf(permissionName) != -1;
    }

    save(): void {
        const role = this.model.role;
        let tmpPermissions = [];

        this.permissionList.forEach((item) => {
            if (item.checked) {
                tmpPermissions.push(item.value);
            }
        });


        this.saving = true;
        var input = new RoleDto();
        input.init(role);

        input.permissions = tmpPermissions;

        this.roleService.update(input)
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
