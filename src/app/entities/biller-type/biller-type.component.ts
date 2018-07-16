import { Component, OnInit } from '@angular/core';
import { BillerType } from './biller-type.model';
import { MatDialog } from '@angular/material';
import { BillerTypeService } from './biller-type.service';
import { BillerTypeDialogComponent } from './biller-type-dialog.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BillerTypeConfirmComponent } from './biller-type-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, REPORT_PATH, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-biller-type',
  templateUrl: './biller-type.component.html',
  styleUrls: ['./biller-type.component.css']
})
export class BillerTypeComponent implements OnInit {


    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    billerTipes: BillerType[];
    BillerType: BillerType;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    nativeWindow: any;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    billPayTypeList = [];

    filter = {
        name : null,
        billPayType: 'ALL',
      };

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 100, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'name', width: 400, editable: false },
            { headerName: 'Type', field: 'billPayType', width: 150, editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
          // { headerName: ' ', suppressMenu: true,
          //   suppressSorting: true,
          //   template:
          //     `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
          //       Edit
          //     </button>
          //     ` }
        ],
        rowData: this.billerTipes,
        enableSorting: true,
        enableFilter: true,
        pagination: true,
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

    boolFormatter(params): string {
        return params.value === true ? 'Postpaid' : 'Prepaid';
    }

    currencyFormatter(params): string {
        const dt  = new Date(params.value);
        return dt.toLocaleString(['id']);
    }

    constructor(  private dialog: MatDialog,
                private billerTypeService: BillerTypeService,
        private sharedService: SharedService ) { }

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
        const dialogRef = this.dialog.open(BillerTypeDialogComponent, {
        width: '1000px',
        data: { action: 'Edit', entity: 'Bill Type', BillerType: data }
        });

        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        this.loadAll(this.curPage);
        });
    }

    public onActionRemoveClick(data: BillerType) {
        console.log('Remove action clicked', data);
        const biller: string = data.name;
        const dialogConfirm = this.dialog.open(BillerTypeConfirmComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
        });

        dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        });

    }

    loadAll(page) {
        console.log('Start call function all header');
        this.billerTypeService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
                (res: HttpResponse<BillerType[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    filterBtn(): void {
        let statusAll = false;
        switch (this.filter.billPayType) {
          case 'ALL':
              console.log('hapus active');
              statusAll = true;
              // delete this.filter.active ;
              this.filter.billPayType = null;
              break;
      //     case 'ACTIVE':
      //     // lastStatus = 'ACTIVE';
      //         this.filter.active = true;
      //         break;
      //     default:
      //         this.filter.active = null;
      //         break;
      }
      this.billerTypeService.filter({
          page: this.curPage,
          count: this.totalRecord,
          filter: this.filter,
      })
      .subscribe(
          (res: HttpResponse<BillerType[]>) => this.onSuccess(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message),
          () => { console.log('finally');
                  if ( statusAll ) {
                    this.filter.billPayType = 'ALL';
                  }
                }
        );
      }

    ngOnInit() {
        this.sharedService.getBillPayType()
        .subscribe(
                (res) => {
                    this.billPayTypeList = [];
                    this.billPayTypeList.push('ALL');
                    for (const datas of res.body) {
                        console.log(datas);
                        this.billPayTypeList.push(datas);
                    }
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
        this.loadAll(this.curPage);
    }

    openNewDialog(): void {
        const dialogRef = this.dialog.open(BillerTypeDialogComponent, {
            width: '1000px',
            data: { action: 'Add', entity: 'Bill Type' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
            if (result === 'refresh') {
                this.loadAll(this.curPage);
            }
        });
    }

    private onSuccess(data, headers) {
        if ( data.content.length < 0 ) {
            return ;
        }

        this.billerTipes = data.content;
        let urut = 1;
        for (const billerType of this.billerTipes) {
            billerType.nourut = urut++;
        }
        this.totalData = data.totalElements;
        this.gridApi.setRowData(this.billerTipes);
    }

    private onError(error) {
        console.log('error..');
    }

    // public exportCSV(reportType): void {
    //     const path = this.resourceUrl  + 'billertype';
    //     window.open(`${path}/${reportType}`);
    // }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        this.loadAll(this.curPage);
    }

    public async exportCSV(reportType): Promise<void> {

        // const membType = (this.memberTypeList.length === 1 && this.memberTypeList[0].id === 1 ? 1 : 0);
         const blob = await this.billerTypeService.exportCSV();
         const url = window.URL.createObjectURL(blob);
         // const link = this.downloadZipLink.nativeElement;
         const link = document.createElement('a');
         document.body.appendChild(link);
         link.setAttribute('style', 'display: none');
         link.href = url;
         link.download = 'billertype.csv';
         link.click();
         window.URL.revokeObjectURL(url);
     }

    //  loadBillPayType(): void {
    //     this.sharedService.getBillPayType().subscribe(
    //         (res) => {
    //             this.billPayTypeList = [];
    //             this.billPayTypeList.push('ALL');
    //             for (const datas of res.body) {
    //               console.log(datas);
    //               this.billPayTypeList.push(datas);
    //             }
    //         },
    //         (res: HttpErrorResponse) => this.onError(res.message),
    //         () => { console.log('finally'); }
    //     );
    //   }
}
