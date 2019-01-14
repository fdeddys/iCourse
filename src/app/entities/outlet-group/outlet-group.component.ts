import { Component, OnInit, ViewChild } from '@angular/core';
import { OutletGroup } from './outlet-group.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { OutletGroupService } from './outlet-group.service';
import { OutletGroupDialogComponent } from './outlet-group-dialog.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { BillerTypeConfirmComponent } from './biller-type-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, REPORT_PATH, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { SharedService } from '../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-outlet-group',
  templateUrl: './outlet-group.component.html',
  styleUrls: ['./outlet-group.component.css']
})
export class OutletGroupComponent implements OnInit {


    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    outletGroups: OutletGroup[];
    outletGroup: OutletGroup;
    filter: OutletGroup;

    messageNoData: string = NO_DATA_GRID_MESSAGE;
    nativeWindow: any;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    gridOptions = {
        columnDefs: [
            { headerName: 'Name', field: 'name', width: 450, editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.outletGroups,
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
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };
    currencyFormatter(params): string {
        const dt  = new Date(params.value);
        return dt.toLocaleString(['id']);
    }

    constructor(translateService: TranslateService,
                private dialog: MatDialog,
                private outletGroupService: OutletGroupService,
        private sharedService: SharedService ) {
            translateService.use('en');
            this.filter = new OutletGroup();
            this.outletGroup = new OutletGroup();
            this.outletGroup.name = '';
            this.outletGroup.id = 0;
            this.filter.errCode = '';
            this.filter = this.outletGroup;
        }

    public onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

        switch (actionType) {
            case 'edit':
                return this.onActionEditClick(data);
            }
        }
    }

    public onActionEditClick(data: any) {
        console.log('View action clicked', data);
        const dialogRef = this.dialog.open(OutletGroupDialogComponent, {
        width: '600px',
        data: { action: 'Edit', entity: 'Outlet Group', OutletGroup: data }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed = [', result, ']');
            // this.loadAll(this.curPage);
            this.filterBtn('');
        });
    }

    loadAll(page) {
        console.log('Start call function all header');
        this.outletGroupService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
                (res: HttpResponse<OutletGroup[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    actionfilter(): void {
        this.paginator._pageIndex = 0;
        this.filterBtn(1);
    }

    filterBtn(page): void {
        if (page !== '') {
            this.curPage = page;
        }

        this.outletGroupService.filter({
          page: this.curPage,
          count: this.totalRecord,
          filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<OutletGroup[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally');

                    }
            );
        }

    ngOnInit() {

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

    openNewDialog(): void {
        const dialogRef = this.dialog.open(OutletGroupDialogComponent, {
            width: '600px',
            data: { action: 'Add', entity: 'Outlet Group' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
            if (result === 'refresh') {
                // this.loadAll(this.curPage);
                this.filterBtn('');
            }
        });
    }

    private onSuccess(data, headers) {
        console.log('on success ', data);
        if ( data.content.length < 0 ) {
            this.totalData = 0;
            this.gridApi.setRowData(null);
            return ;
        }
// alert(data.pageable.offset);
        this.outletGroups = data.content;
        this.totalData = data.totalElements;
        this.gridApi.setRowData(this.outletGroups);
    }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

}
