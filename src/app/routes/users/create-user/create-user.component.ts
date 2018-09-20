import { Component, OnInit } from '@angular/core';
import { CreateUserDto, UserServiceProxy, RoleDto } from '@core/abp/service-proxies/service-proxies';
import { finalize } from"rxjs/operators";
import { NotifyService } from '@core/abp/notify/notify.service';
import { NzModalRef } from 'ng-zorro-antd';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit {

    saving: boolean = false;
    user: CreateUserDto = new CreateUserDto();
    roles: RoleDto[] = null;

    roleList = [];

    confirmPassword: string = '';

    constructor(
        private modal: NzModalRef,
        private i18NService: I18NService,
        private userService: UserServiceProxy,
        private notifyService: NotifyService
    ) {
    }

    ngOnInit() {
        this.userService.getRoles()
            .subscribe((result) => {
                this.roles = result.items;

                this.roles.forEach((item) => {
                    this.roleList.push({
                        label: item.displayName, value: item.name, checked: true
                    });
                });
            });
    }

    save(): void {
        let tmpRoleNames = [];
        this.roleList.forEach((item) => {
            if (item.checked) {
                tmpRoleNames.push(item.value);
            }
        });
        this.user.roleNames = tmpRoleNames;

        this.userService.create(this.user)
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
