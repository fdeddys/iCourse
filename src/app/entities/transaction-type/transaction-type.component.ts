import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TransType } from './transaction-type.model';
import { TransTypeService } from './transaction-type.service';
import { TransTypeDialogComponent } from './transaction-type-dialog.component';

import { MatDialog, MatPaginator } from '@angular/material';
import { Filter } from '../../shared/model/filter';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { REPORT_PATH } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-transaction-type',
    templateUrl: './transaction-type.component.html',
    styleUrls: ['./transaction-type.component.css', '../../layouts/content/content.component.css']
})

export class TransTypeComponent implements OnInit {
    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    entityName: String = 'Transaction Type';
    @ViewChild(MatPaginator) paginator: MatPaginator;

    transTypes: TransType[];

    cssButton = CSS_BUTTON;
    theme: String = GRID_THEME;
    filter: Filter = {
        'name': ''
    };
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    messageNoData: string = NO_DATA_GRID_MESSAGE;

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 100, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
            { headerName: 'Code', field: 'code', width: 220, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'name', width: 600, pinned: 'left', editable: false },
            { headerName: ' ', width: 100, minWidth: 100, maxWidth: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.transTypes,
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            // checkboxRenderer: MatCheckboxComponent,
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        translate: TranslateService,
        private dialog: MatDialog,
        private transTypeService: TransTypeService
    ) {
        translate.use('en');
    }

    ngOnInit() {

    }

    loadAll(page) {
        console.log('Start call function all header');
        this.transTypeService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<TransType[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    actionfilter(): void {
        this.paginator._pageIndex = 0;
        this.filterData(1);
    }

    filterData(page): void {
        if (page !== '') {
            this.curPage = page;
        }
        this.transTypeService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<TransType[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        if (data.content.length < 0) {
            return;
        }
        this.transTypes = data.content;
        let i = data.pageable.offset + 1;
        for (const transType of this.transTypes) {
            transType.no = i++;
        }
        this.gridApi.setRowData(this.transTypes);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // params.api.sizeColumnsToFit();
        // this.loadAll(this.curPage);
        this.filterData('');
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
        const dialogRef = this.dialog.open(TransTypeDialogComponent, {
            width: '60%',
            data: { action: 'Edit', entity: this.entityName, transType: data }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
           // if (result === 'refresh') {
                this.loadAll(this.curPage);
           // }
        });
    }

    public onActionRemoveClick(data: TransType) {
        console.log('Remove action clicked', data);
        // const biller: string = data.name;
        // const dialogConfirm = this.dialog.open(BillerCompanyConfirmComponent, {
        //     width: '50%',
        //     data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
        // });

        // dialogConfirm.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed');
        // });
    }

    openNewDialog(): void {
        const dialogRef = this.dialog.open(TransTypeDialogComponent, {
            width: '60%',
            data: {action: 'Add', entity:  this.entityName}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
            if (result === 'refresh') {
                this.filterData(this.curPage);
            }
        });
    }

    public onPaginateChange($event): void {
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterData('');
    }

    public async exportCSV(reportType): Promise<void> {
        // const blob = await this.transTypeService.exportCSV();
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // document.body.appendChild(link);
        // link.setAttribute('style', 'display: none');
        // link.href = url;
        // link.download = 'Transation Type.csv';
        // link.click();
        // link.remove();
        // window.URL.revokeObjectURL(url);

        const blob = await this.transTypeService.exportCSV({filter: this.filter }).then(
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
}
