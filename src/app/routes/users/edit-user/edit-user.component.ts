import { Component, OnInit, Injector, Input, AfterViewInit } from '@angular/core';
import { UserServiceProxy, RoleDto, UserDto, RoleServiceProxy, ListResultDtoOfPermissionDto } from '@core/abp/service-proxies/service-proxies';
import { zip } from 'rxjs';
import { catchError, finalize } from "rxjs/operators";
import { NotifyService } from '@core/abp/notify/notify.service';
import { NzModalRef } from 'ng-zorro-antd';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styles: []
})
export class EditUserComponent implements OnInit {


    @Input() id: number;
    saving: boolean = false;
    user: UserDto = undefined;
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
        this.saving = true;

        zip(
            this.userService.getRoles(),
            this.userService.get(this.id)
        ).pipe(
            catchError(([roles, user]) => {
                this.notifyService.error(this.i18NService.localize('LoadingFailedTryAgain'));
                return [roles, user];
            }),
            finalize(() => this.saving = false)
        ).subscribe(
            ([roles, user]) => {
                this.roles = roles.items;
                this.user = user;
                this.roles.forEach((item) => {
                    this.roleList.push({
                        label: item.displayName, value: item.name, checked: this.userInRole(item, this.user)
                    });
                });
            }
        )
    }

    userInRole(role: RoleDto, user: UserDto): boolean {
        return user.roleNames.indexOf(role.normalizedName) !== -1;
    }

    save(): void {
        let tmpRoleNames = [];
        this.roleList.forEach((item) => {
            if (item.checked) {
                tmpRoleNames.push(item.value);
            }
        });
        this.user.roleNames = tmpRoleNames;

        this.userService.update(this.user)
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
