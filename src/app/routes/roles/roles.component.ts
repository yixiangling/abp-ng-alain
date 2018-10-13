import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@core/abp/components';
import { RoleServiceProxy, RoleDto } from '@core/abp/service-proxies/service-proxies';
import { ModalHelper } from '@delon/theme';

import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { I18NService } from '@core/i18n/i18n.service';
import { NotifyService } from '@core/abp/notify/notify.service';

@Component({
    templateUrl: './roles.component.html'
})
export class RolesComponent extends PagedListingComponentBase<RoleDto> {
    constructor(
        private modalHelper: ModalHelper,
        private i18NService: I18NService,
        private rolesService: RoleServiceProxy,
        private notifyService: NotifyService
    ) {
        super();
    }

    protected list(request: PagedRequestDto, pageNumber: number): Observable<PagedResultDto> {
        return this.rolesService.getAll(request.skipCount, request.maxResultCount);
    }

    protected delete(item: RoleDto): void {
        this.rolesService.delete(item.id).subscribe(() => {
            this.notifyService.success(this.i18NService.localize('SuccessfullyDeleted'));
            this.refresh();
        });
    }

    create(): void {
        this.modalHelper.open(CreateRoleComponent, undefined, 'md', { nzMaskClosable: false }).subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }

    edit(item: RoleDto): void {
        this.modalHelper.open(EditRoleComponent, { id: item.id }, 'md', { nzMaskClosable: false }).subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
}
