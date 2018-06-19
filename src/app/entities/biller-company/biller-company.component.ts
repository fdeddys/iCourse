import { Component, OnInit } from '@angular/core';
import { BillerCompany } from './biller-company.model';
import { MatDialog } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BillerCompanyService } from './biller-company.service';
import { BillerCompanyDialogComponent } from './biller-company-dialog.component';
import { BillerCompanyConfirmComponent } from './biller-company-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';

@Component({
  selector: 'app-biller-company',
  templateUrl: './biller-company.component.html',
  styleUrls: ['./biller-company.component.css']
})
export class BillerCompanyComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  theme: String = GRID_THEME;
  cssButton = CSS_BUTTON  ;

  billerCompanies: BillerCompany[];
  billerCompany; BillerCompany;
  messageNoData: string = NO_DATA_GRID_MESSAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'id', field: 'id', width: 50, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', width: 250, editable: false },
      { headerName: ' ', suppressMenu: true,
        suppressSorting: true,
        template:
          `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
            Edit
          </button>` }
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
      onPaginationChanged: this.onPaginationChanged(),
      localeText: {noRowsToShow: this.messageNoData}
  };

  // <button type="button" data-action-type="inactive" class="btn btn-default">
  //           Inactive
  //         </button>

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
        data: { action: 'Edit', entity: 'Biller Company', billerCompany: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        if (result === 'refresh') {
          this.loadAll();
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

  // openConfirm(): void {
  //   const dialogConfirm = this.dialog.open(BillerCompanyConfirmComponent, {
  //     width: '250px',
  //     data: { name: 'confirm inactive' }
  //   });

  //   dialogConfirm.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }


  loadAll() {
        console.log('Start call function all header');
        this.billerCompanyService.query({
            page: 1,
            count: 10000,
            // size: this.itemsPerPage,
            // sort: this.sort()
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
    params.api.sizeColumnsToFit();
    this.loadAll();
  }

  onPaginationChanged() {
    console.log('onPaginationPageLoaded');

    // Workaround for bug in events order
    if (this.gridApi) {
        // setText('#lbLastPageFound', gridOptions.api.paginationIsLastPageFound());
        // setText('#lbPageSize', gridOptions.api.paginationGetPageSize());
        // // we +1 to current page, as pages are zero based
        // setText('#lbCurrentPage', gridOptions.api.paginationGetCurrentPage() + 1);
        // setText('#lbTotalPages', gridOptions.api.paginationGetTotalPages());

        // setLastButtonDisabled(!gridOptions.api.paginationIsLastPageFound());
    }
}

  openNewDialog(): void {
    const dialogRef = this.dialog.open(BillerCompanyDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'Biller Company' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed = [', result, ']');
      if (result === 'refresh') {
        this.loadAll();
      }
    });
  }

  private onSuccess(data, headers) {
      // console.log('success..');
      // console.log('isi biller companies len ==> ', data.content );

      if ( data.content.length <= 0 ) {
          return ;
      }

      this.billerCompanies = data.content;
      this.gridApi.setRowData(this.billerCompanies);

      // const dataSource = {
      //   rowCount: data.totalElements, // for example
      //   getRows: function (params) {
      //       console.log('isi biller companies[] ==> ', this.billerCompanies );
      //       const rowsThisPage =  data.content;
      //       params.successCallback(rowsThisPage, data.totalElements);
      //   }
      // };
      // this.gridApi.setDatasource(dataSource);
      // console.log(this.gridApi.paginationGetPageSize());

  }

  private onError(error) {
    console.log('error..');
  }


}
