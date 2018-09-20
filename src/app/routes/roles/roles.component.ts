import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@core/abp/components';
import { RoleServiceProxy, RoleDto } from '@core/abp/service-proxies/service-proxies';
import { ModalHelper } from '@delon/theme';

import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

@Component({
    templateUrl: './roles.component.html'
})
export class RolesComponent extends PagedListingComponentBase<RoleDto> {
    constructor(
        private modalHelper: ModalHelper,
        private rolesService: RoleServiceProxy
    ) {
        super();
    }

    protected list(request: PagedRequestDto, pageNumber: number): Observable<PagedResultDto> {
        return this.rolesService.getAll(request.skipCount, request.maxResultCount);
    }

    protected delete(item: RoleDto): void {
        this.rolesService.delete(item.id).subscribe(() => { this.refresh(); });
    }

    create(): void {
        this.modalHelper.open(CreateRoleComponent, undefined, 'md', { nzMask: true }).subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }

    edit(item: RoleDto): void {
        this.modalHelper.open(EditRoleComponent, { id: item.id }, 'md', { nzMask: true }).subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
}
