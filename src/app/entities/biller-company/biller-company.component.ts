import { Component, OnInit, ViewChild } from '@angular/core';
import { BillerCompany } from './biller-company.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BillerCompanyService } from './biller-company.service';
import { BillerCompanyDialogComponent } from './biller-company-dialog.component';
import { BillerCompanyConfirmComponent } from './biller-company-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-biller-company',
    templateUrl: './biller-company.component.html',
    styleUrls: ['./biller-company.component.css', '../../layouts/content/content.component.css']
})
export class BillerCompanyComponent implements OnInit {

  entityName: String = 'Bill Operator';
  private gridApi;
  private gridColumnApi;
  private resourceUrl = REPORT_PATH;
  @ViewChild(MatPaginator) paginator: MatPaginator;

    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;

    billerCompanies: BillerCompany[];
    billerCompany; BillerCompany;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;

    filter = {
      name : null
    };

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 100, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'name', width: 770, editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.billerCompanies,
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
        // console.log('cur format ', dt.toISOString().slice(0, 10) , ' ', dt.toISOString().slice(0, 10).replace(/-/g, ''));
        // console.log('cur format ', dt.toLocaleString('id', { timeZone: 'UTC' }));
        // return dt.toLocaleString('id', { timeZone: 'UTC' });
        return dt.toLocaleString(['id']);
    }

    constructor(  translate: TranslateService,
                  private dialog: MatDialog,
                  private billerCompanyService: BillerCompanyService) {
                      translate.setDefaultLang('en');
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
        const dialogRef = this.dialog.open(BillerCompanyDialogComponent, {
          width: '600px',
          data: { action: 'Edit', entity: this.entityName, billerCompany: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed = [', result, ']');
         // if (result === 'refresh') {
            this.loadAll(this.curPage);
         // }
        });
    }

    public onActionRemoveClick(data: BillerCompany) {
        console.log('Remove action clicked', data);
        const biller: string = data.name;
        const dialogConfirm = this.dialog.open(BillerCompanyConfirmComponent, {
          width: '50%',
          data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
        });

        dialogConfirm.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });

    }

    loadAll(page) {
        console.log('Start call function all header');
        this.billerCompanyService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<BillerCompany[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
      }

    actionfilter(): void {
        this.paginator._pageIndex = 0;
        this.filterBtn(1);
    }

    ngOnInit() {
      // this.loadAll();
    }

    filterBtn(page): void {
      if (page !== '') {
        this.curPage = page;
     }
    this.billerCompanyService.filter({
        page: this.curPage,
        count: this.totalRecord,
        filter: this.filter,
    })
    .subscribe(
        (res: HttpResponse<BillerCompany[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message),
        () => { console.log('finally');
              }
      );
    }


    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      console.log(this.gridApi);
      console.log(this.gridColumnApi);
      // params.api.sizeColumnsToFit();
      // this.loadAll(this.curPage);
      this.filterBtn('');
    }

    openNewDialog(): void {
      const dialogRef = this.dialog.open(BillerCompanyDialogComponent, {
        width: '600px',
        data: { action: 'Add', entity: 'Biller Company' }
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

        this.billerCompanies = data.content;
        let urut = 1;
        for (const billerCompany of this.billerCompanies) {
          billerCompany.nourut = urut++;
        }
        this.gridApi.setRowData(this.billerCompanies);
        this.totalData = data.totalElements;
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

    public async exportCSV(reportType): Promise<void> {
         const blob = await this.billerCompanyService.exportCSV();
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         document.body.appendChild(link);
         link.setAttribute('style', 'display: none');
         link.href = url;
         link.download = 'billoperator.csv';
         link.click();
         link.remove();
         window.URL.revokeObjectURL(url);
     }

}

