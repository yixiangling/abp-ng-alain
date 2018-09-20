import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from '@core/abp/components';
import { PagedResultDtoOfUserDto, UserServiceProxy, UserDto } from '@core/abp/service-proxies/service-proxies';
import { ModalHelper } from '@delon/theme';

import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
    templateUrl: './users.component.html'
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {
    constructor(
        private modalHelper: ModalHelper,
        private userService: UserServiceProxy
    ) {
        super();
    }

    protected list(request: PagedRequestDto, pageNumber: number): Observable<PagedResultDto> {
        return this.userService.getAll(request.skipCount, request.maxResultCount);
    }

    protected delete(item: UserDto): void {
        this.userService.delete(item.id).subscribe(()=> {this.refresh();});
    }

    create(): void {
        this.modalHelper.open(CreateUserComponent, undefined, 'md', { nzMask: true }).subscribe(result => {
            if(result){
                this.refresh();
            }
        });
    }

    edit(item: UserDto): void {
        this.modalHelper.open(EditUserComponent, { id: item.id }, 'md', { nzMask: true }).subscribe(result => {
            if(result){
                this.refresh();
            }
        });
    }
}
