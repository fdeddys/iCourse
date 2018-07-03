import { Component, OnInit } from '@angular/core';
import { BillerCompany } from './biller-company.model';
import { MatDialog } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BillerCompanyService } from './biller-company.service';
import { BillerCompanyDialogComponent } from './biller-company-dialog.component';
import { BillerCompanyConfirmComponent } from './biller-company-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

@Component({
    selector: 'app-biller-company',
    templateUrl: './biller-company.component.html',
    styleUrls: ['./biller-company.component.css']
})
export class BillerCompanyComponent implements OnInit {

  entityName: String = 'Bill Operator';
  private gridApi;
  private gridColumnApi;
  private resourceUrl = REPORT_PATH;

    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;

    billerCompanies: BillerCompany[];
    billerCompany; BillerCompany;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = 2;
    // TOTAL_RECORD_PER_PAGE;

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 100, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'name', width: 400, editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.billerCompanies,
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
        // console.log('cur format ', dt.toISOString().slice(0, 10) , ' ', dt.toISOString().slice(0, 10).replace(/-/g, ''));
        // console.log('cur format ', dt.toLocaleString('id', { timeZone: 'UTC' }));
        // return dt.toLocaleString('id', { timeZone: 'UTC' });
        return dt.toLocaleString(['id']);
    }

    constructor(  private dialog: MatDialog,
                  private billerCompanyService: BillerCompanyService) { }

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
          width: '1000px',
          data: { action: 'Edit', entity: this.entityName, billerCompany: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed = [', result, ']');
          if (result === 'refresh') {
            this.loadAll(this.curPage);
          }
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

    ngOnInit() {
      // this.loadAll();
    }

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      console.log(this.gridApi);
      console.log(this.gridColumnApi);
      // params.api.sizeColumnsToFit();
      this.loadAll(this.curPage);
    }

    openNewDialog(): void {
      const dialogRef = this.dialog.open(BillerCompanyDialogComponent, {
        width: '1000px',
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

        if ( data.content.length <= 0 ) {
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
        this.loadAll(this.curPage);
    }

    public exportCSV(reportType): void {
        const path = this.resourceUrl  + 'billercompany';
        window.open(`${path}/${reportType}`);
    }
}

