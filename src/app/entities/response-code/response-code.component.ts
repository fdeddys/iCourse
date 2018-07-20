import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponseCode } from './response-code.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { ResponseCodeService } from './response-code.service';
import { ResponseCodeDialogComponent } from './response-code-dialog.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ResponseCodeConfirmComponent } from './response-code-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, REPORT_PATH, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { Member, MemberService } from '../member';

@Component({
  selector: 'app-response-code',
  templateUrl: './response-code.component.html',
  styleUrls: ['./response-code.component.css']
})
export class ResponseCodeComponent implements OnInit {


    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    responseCodes: ResponseCode[];
    ResponseCode: ResponseCode;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    nativeWindow: any;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    memberList = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    filter = {
        name : null,
        billPayType: 'ALL',
      };

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 100, pinned: 'left', editable: false },
            { headerName: 'Response Code', field: 'responseCode', width: 200, editable: false },
            { headerName: 'Description', field: 'description', width: 200, editable: false },
            { headerName: 'Member', field: 'member.name', width: 300, pinned: 'left', editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
          // { headerName: ' ', suppressMenu: true,
          //   suppressSorting: true,
          //   template:
          //     `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
          //       Edit
          //     </button>
          //     ` }
        ],
        rowData: this.responseCodes,
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
    currencyFormatter(params): string {
        const dt  = new Date(params.value);
        return dt.toLocaleString(['id']);
    }

    constructor(  private dialog: MatDialog,
                private responseCodeService: ResponseCodeService,
        private memberService: MemberService ) { }

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
        const dialogRef = this.dialog.open(ResponseCodeDialogComponent, {
        width: '1000px',
        data: { action: 'Edit', entity: 'Bill Type', ResponseCode: data, memberData: this.memberList }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed = [', result, ']');
            // this.loadAll(this.curPage);
            this.filterBtn('');
        });
    }

    public onActionRemoveClick(data: ResponseCode) {
        console.log('Remove action clicked', data);
        const responseCode: string = data.responseCode;
        const dialogConfirm = this.dialog.open(ResponseCodeConfirmComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${responseCode}` + '  ]  ?',  idCompanyBiller: data.id }
        });

        dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        });

    }

    loadAll(page) {
        console.log('Start call function all header');
        this.responseCodeService.query  ({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
                (res: HttpResponse<ResponseCode[]>) => this.onSuccess(res.body, res.headers),
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
      this.responseCodeService.filter({
          page: this.curPage,
          count: this.totalRecord,
          filter: this.filter,
      })
      .subscribe(
          (res: HttpResponse<ResponseCode[]>) => this.onSuccess(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message),
          () => { console.log('finally');
                  if ( statusAll ) {
                    this.filter.billPayType = 'ALL';
                  }
                }
        );
      }

    ngOnInit() {
        this.memberService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<Member[]>) => this.onSuccessMemb(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    private onSuccessMemb(data, headers) {
        console.log('isi response ==> ', data);
        this.memberList = data.content;
    }


    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

    openNewDialog(mode, data): void {
        const dialogRef = this.dialog.open(ResponseCodeDialogComponent, {
            width: '1000px',
            data: { action: 'Add', entity: 'Response Code', memberData: this.memberList }
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

        this.responseCodes = data.content;
        let urut = 1;
        for (const responseCode of this.responseCodes) {
            responseCode.nourut = urut++;
        }
        this.totalData = data.totalElements;
        this.gridApi.setRowData(this.responseCodes);
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
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

    public async exportCSV(reportType): Promise<void> {

        // const membType = (this.memberTypeList.length === 1 && this.memberTypeList[0].id === 1 ? 1 : 0);
         const blob = await this.responseCodeService.exportCSV();
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
