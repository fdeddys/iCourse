import { Component, OnInit, ViewChild } from '@angular/core';
import { Outlet } from './outlet.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { OutletService } from './outlet.service';
import { OutletDialogComponent } from './outlet-dialog.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { OutletConfirmComponent } from './outlet-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, REPORT_PATH, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { SharedService } from '../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { OutletGroupService } from '../outlet-group';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.css']
})
export class OutletComponent implements OnInit {


    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    outlets: Outlet[];
    Outlet: Outlet;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    nativeWindow: any;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    outletGroupList = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    filter = {
        name : null,
        billPayType: 'ALL',
      };

    gridOptions = {
        columnDefs: [
            { headerName: 'Name', field: 'name', width: 450, editable: false },
            { headerName: 'Group', field: 'groupOutlet.name', width: 320, editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.outlets,
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
                private outletService: OutletService,
                private outletGroupService: OutletGroupService ) {
                translateService.use('en');
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
        console.log('View action clicked',  this.outletGroupList);

        const dialogRef = this.dialog.open(OutletDialogComponent, {
            width: '600px',
            data: { action: 'Edit', entity: 'Outlet', Outlet: data, OutletGroupList: this.outletGroupList }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.filterBtn('');
        });
    }

    public onActionRemoveClick(data: Outlet) {
        console.log('Remove action clicked', data);
        const biller: string = data.name;
        const dialogConfirm = this.dialog.open(OutletConfirmComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
        });

        dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        });

    }

    loadAll(page) {
        console.log('Start call function all header');
        this.outletService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
                (res: HttpResponse<Outlet[]>) => this.onSuccess(res.body, res.headers),
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
        let statusAll = false;
        switch (this.filter.billPayType) {
          case 'ALL':
              console.log('hapus active');
              statusAll = true;
              // delete this.filter.active ;
              this.filter.billPayType = null;
              break;
        }
        this.outletService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
         .subscribe(
            (res: HttpResponse<Outlet[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally');
                  if ( statusAll ) {
                    this.filter.billPayType = 'ALL';
                  }
                }
        );
    }

    ngOnInit() {
        this.outletGroupService.filter({
            page: 1,
            count: 1000,
            filter: {
                id : 0,
                name : '',
            }
        })
        .subscribe(
                (res) => {
                    this.onSuccessOutletGroup(res.body, res.headers);
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
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
        console.log('isi list group ', this.outletGroupList);
        const dialogRef = this.dialog.open(OutletDialogComponent, {
            width: '600px',
            data: { action: 'Add', entity: 'Outlet',  OutletGroupList: this.outletGroupList  }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
            if (result === 'refresh') {
                this.filterBtn('');
            }
        });
    }

    private onSuccessOutletGroup(data, headers) {
        if ( data.content.length < 0 ) {
            return ;
        }
        this.outletGroupList = data.content;
    }

    private onSuccess(data, headers) {
        if ( data.content.length < 0 ) {
            return ;
        }
        this.outlets = data.content;
        // let urut = data.pageable.offset + 1;
        // for (const outlet of this.outlets) {
        //     outlet.nourut = urut++;
        // }
        this.totalData = data.totalElements;
        this.gridApi.setRowData(this.outlets);
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
