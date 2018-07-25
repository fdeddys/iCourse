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
import { Biller, BillerService } from '../biller';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-response-code',
  templateUrl: './response-code.component.html',
  styleUrls: ['./response-code.component.css', '../../layouts/content/content.component.css'],
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
    billerList = [];
    menuName = '';
    gridOption = '';
    respCodeInternalList = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    filter: ResponseCodeFilter = {
        responseCode: '',
        description: '',
        memberName: '',
        memberType: ''
    };

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 76, pinned: 'left', editable: false },
            { headerName: 'Code', field: 'responseCode', width: 110, editable: false },
            { headerName: 'Description', field: 'description', width: 290, editable: false },
            { headerName: 'Member', field: 'billerHeader.member.name', width: 270,   editable: false },
            { headerName: 'Member Type', field: 'billerHeader.memberType.name', width: 180,  editable: false },
            { headerName: 'Response Code Internal', field: 'billerHeader.memberType.name', width: 180,  editable: false },
            { headerName: ' ', width: 100, cellRenderer: 'actionRenderer'}
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
        enableColResize: true,
        pagination: true,
        paginationPageSize: 10,
        cacheOverflowSize : 2,
        maxConcurrentDatasourceRequests : 2,
        infiniteInitialRowCount : 1,
        maxBlocksInCache : 2,
       // rowHeight : 34,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    gridOptionsInternal = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 76, pinned: 'left', editable: false },
            { headerName: 'Code', field: 'responseCode', width: 300, editable: false },
            { headerName: 'Description', field: 'description', width: 540, editable: false },
            { headerName: ' ', width: 100, cellRenderer: 'actionRenderer'}
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
        enableColResize: true,
        pagination: true,
        paginationPageSize: 10,
        cacheOverflowSize : 2,
        maxConcurrentDatasourceRequests : 2,
        infiniteInitialRowCount : 1,
        maxBlocksInCache : 2,
       // rowHeight : 34,
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
        private memberService: MemberService,
        private billerService: BillerService,
        private route: ActivatedRoute,
        translate: TranslateService, ) {
           // translate.setDefaultLang('en');
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
        const typeRespCode = (data.billerHeader  === null) ? 0 : 1;

        const dialogRef = this.dialog.open(ResponseCodeDialogComponent, {
        width: '750px',
        data: { action: 'Edit', entity: 'Response Code', responseCode: data, billerData: this.billerList,
             typeRespCode : typeRespCode, respCodeInternalData: this.respCodeInternalList }
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
        this.responseCodeService.filter({
            allData: (this.route.snapshot.routeConfig.path === 'response-code-internal' ? 0 : 1),
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
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
      this.responseCodeService.filter({
          allData: (this.route.snapshot.routeConfig.path === 'response-code-internal' ? 0 : 1),
          page: this.curPage,
          count: this.totalRecord,
          filter: this.filter,
      })
      .subscribe(
          (res: HttpResponse<ResponseCode[]>) => this.onSuccess(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message),
          () => { console.log('finally');
                }
        );
      }
    ngOnInit() {

        if (this.route.snapshot.routeConfig.path === 'response-code') {
            this.menuName = 'ResponseCode';
            this.gridOption = 'gridOptions';
        } else if (this.route.snapshot.routeConfig.path === 'response-code-internal') {
            this.menuName = 'ResponseCodeInternal';
            this.gridOption = 'gridOptionsInternal';
        }

        this.billerService.queryAll({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<Biller[]>) => {
                     this.onSuccessMemb(res.body, res.headers);
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

        this.responseCodeService.filter({
            allData: 0,
            page: 1,
            count: 10000,
            filter: this.filter,
        })
        .subscribe(
                (res: HttpResponse<ResponseCode[]>) => {
                     this.onSuccesRespCdInternal(res.body, res.headers);
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
        console.log('', this.billerList);
    }
    private onSuccesRespCdInternal(data, headers) {
        this.respCodeInternalList = data.content;
        // console.log('respCodeInternalList', this.respCodeInternalList);
   }
    private onSuccessMemb(data, headers) {
         this.billerList = data.content;
    }
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

    openNewDialog(typeRespCode): void {
        const dialogRef = this.dialog.open(ResponseCodeDialogComponent, {
            width: '750px',
            data: { action: 'Add', entity: 'Response Code', billerData: this.billerList,
             typeRespCode : typeRespCode, respCodeInternalData: this.respCodeInternalList }
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

    public async exportMemRespCdCSV(reportType): Promise<void> {

         const blob = await this.responseCodeService.exportMemRespCdCSV();
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         document.body.appendChild(link);
         link.setAttribute('style', 'display: none');
         link.href = url;
         link.download = 'memberresponsecode.csv';
         link.click();
         window.URL.revokeObjectURL(url);
     }

     public async exportIntRespCdCSV(reportType): Promise<void> {

         const blob = await this.responseCodeService.exportIntlRespCdCSV();
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         document.body.appendChild(link);
         link.setAttribute('style', 'display: none');
         link.href = url;
         link.download = 'internalresponsecode.csv';
         link.click();
         window.URL.revokeObjectURL(url);
     }
}

export interface ResponseCodeFilter {
    responseCode?: string;
    description?: string;
    memberName?: string;
    memberType?: string;
}
