import { Component, OnInit, ViewChild } from '@angular/core';
import { MemberType } from './member-type.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { MemberTypeService } from './member-type.service';
import { MemberTypeDialogComponent } from './member-type-dialog.component';
import { MemberTypeConfirmComponent } from './member-type-confirm.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { Filter } from '../../shared/model/filter';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-member-type',
    templateUrl: './member-type.component.html',
    styleUrls: ['./member-type.component.css', '../../layouts/content/content.component.css']
})
export class MemberTypeComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    memberTipes: MemberType[];
    MemberType: MemberType;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    private resourceUrl = REPORT_PATH;
    // manualPage = null;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    filter: Filter = {
        name: '',
        description: '',
    };

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 100, minWidth: 100, maxWidth: 100, editable: false,  pinned: 'left'},
            { headerName: 'Name', field: 'name', width: 300, editable: false},
            { headerName: 'Description', field: 'description', width: 470,  editable: false },
            { headerName: ' ', width: 150, minWidth: 150, maxWidth: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.memberTipes,
        enableSorting: true,
        enableFilter: true,
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        cacheOverflowSize : 2,
        maxConcurrentDatasourceRequests : 2,
        infiniteInitialRowCount : 1,
        maxBlocksInCache : 2,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        suppressHorizontalScroll: false,
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(  translate: TranslateService,
                  private dialog: MatDialog,
                  private memberTypeService: MemberTypeService) {
                    translate.use('en');
                  }

    public onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

            switch (actionType) {
                case 'edit':
                    return this.onActionEditClick(data);
                case 'inactive':
                    return this.onActionRemoveClick(data);
            }
        }
    }

    public onActionEditClick(data: any) {
        console.log('View action clicked', data);
        const dialogRef = this.dialog.open(MemberTypeDialogComponent, {
            width: '600px',
            data: { action: 'Edit', entity: 'Member Type', memberType: data }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
                this.filterBtn('');
        });
    }

    public onActionRemoveClick(data: MemberType) {
        console.log('Remove action clicked', data);
        const member: string = data.name;
        const dialogConfirm = this.dialog.open(MemberTypeConfirmComponent, {
            width: '50%',
            data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${member}` + '  ]  ?',  idCompanyMember: data.id }
        });

        dialogConfirm.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });

    }

    loadAll(page) {
        console.log('Start call function all header page:', page, ' total per page ', this.totalRecord);
        this.memberTypeService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<MemberType[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    ngOnInit() {
        // this.loadAll();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.filterBtn('');
    }

    openNewDialog(): void {
        const dialogRef = this.dialog.open(MemberTypeDialogComponent, {
            width: '600px',
            data: { action: 'Add', entity: 'Member Type' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
            // this.loadAll(this.curPage);
            this.filterBtn('');
        });
    }

    private onSuccess(data, headers) {
        if ( data.content.length < 0 ) {
            return ;
        }

        this.memberTipes = data.content;
        let urut = data.pageable.offset + 1;
        for (const memberType of this.memberTipes) {
            memberType.nourut = urut++;
        }
        this.gridApi.setRowData(this.memberTipes);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        // this.paginator._pageIndex = 0;
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        // console.log('On page change ', this.curPage);
        this.filterBtn('');
    }

    public async exportCSV(reportType): Promise<void> {

        // const membType = (this.memberTypeList.length === 1 && this.memberTypeList[0].id === 1 ? 1 : 0);
        // const blob = await this.memberTypeService.exportCSV();
        // const url = window.URL.createObjectURL(blob);

        // // const link = this.downloadZipLink.nativeElement;
        // const link = document.createElement('a');
        // document.body.appendChild(link);
        // link.setAttribute('style', 'display: none');
        // link.href = url;
        // link.download = 'membertype.csv';
        // link.click();
        // link.remove();
        // window.URL.revokeObjectURL(url);

        const blob = await this.memberTypeService.exportCSV({filter: this.filter }).then(
            (resp) => {
                const url = window.URL.createObjectURL(resp.body);
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.setAttribute('style', 'display: none');
                link.href = url;
                link.download = resp.headers.get('File-Name');
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            });

    }

    filterBtn(page): void {
        if (page !== '') {
            this.curPage = page;
        }

        this.memberTypeService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<MemberType[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    actionSearch(): void {
        // this.curPage = $event.pageIndex + 1;
        // this.paginator.pageIndex = $event.pageIndex - 1;
        this.filterBtn(1);
        this.paginator.pageIndex = 0;
    }

    // updateManualPage(index) {
    //     this.manualPage = index;
    //     this.paginator.pageIndex = index - 1;
    //   }

}
