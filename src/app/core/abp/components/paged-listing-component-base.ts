import { Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize } from"rxjs/operators";

export class PagedResultDto {
    items: any[];
    totalCount: number;
}

export class EntityDto {
    id: number;
}

export class PagedRequestDto {
    skipCount: number;
    maxResultCount: number;
}

export class PageingInfo {
    pageSize: number = 10;
    pageNumber: number = 1;
    totalPages: number = 1;
    totalItems: number;
    isTableLoading = false;
}

export abstract class PagedListingComponentBase<EntityDto> implements OnInit {

    public pageingInfo = new PageingInfo();
    public dataItems: EntityDto[] = [];

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.getDataPage(this.pageingInfo.pageNumber);
    }

    public showPaging(result: PagedResultDto, pageNumber: number): void {
        this.pageingInfo.totalPages = ((result.totalCount - (result.totalCount % this.pageingInfo.pageSize)) / this.pageingInfo.pageSize) + 1;

        this.pageingInfo.totalItems = result.totalCount;
        this.pageingInfo.pageNumber = pageNumber;
    }

    public getDataPage(page: number): void {
        var req = new PagedRequestDto();
        req.maxResultCount = this.pageingInfo.pageSize;
        req.skipCount = (page - 1) * this.pageingInfo.pageSize;

        this.pageingInfo.isTableLoading = true;
        this.list(req, page).pipe(
            finalize(() => {
                this.pageingInfo.isTableLoading = false;
            }),
            catchError((error) => {
                return error;
            })
        ).subscribe((result: PagedResultDto)=>{
            this.dataItems = result.items;
            this.showPaging(result, page);
        });
    }

    protected abstract list(request: PagedRequestDto, pageNumber: number): Observable<PagedResultDto>;
    protected abstract delete(entity: EntityDto): void;
}