import { Component, OnInit } from '@angular/core';
import { BillerCompany } from './biller-company.model';
import { MatDialog } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BillerCompanyService } from './biller-company.service';
import { BillerCompanyDialogComponent } from './biller-company-dialog.component';

@Component({
  selector: 'app-biller-company',
  templateUrl: './biller-company.component.html',
  styleUrls: ['./biller-company.component.css']
})
export class BillerCompanyComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  billerCompanies: BillerCompany[];
  billerCompany; BillerCompany;

  gridOptions = {
    columnDefs: [
      { headerName: 'id', field: 'id', width: 250, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', width: 250, editable: false },
      { headerName: 'Created at', field: 'createdAt', width: 250 },
      { headerName: 'Update at', field: 'updatedAt', width: 250 },
      { headerName: 'Created By', field: 'createdBy', width: 250 },
      { headerName: 'Updated By', field: 'updatedBy', width: 250 },
      { headerName: 'action', suppressMenu: true,
        suppressSorting: true,
        template:
          `<button mat-raised-button type="button" data-action-type="view" >
            View
          </button>

          <button type="button" data-action-type="remove" class="btn btn-default">
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
      // getRowNodeId = function(item) {
      //   return item.id;
      // },
      onPaginationChanged: this.onPaginationChanged()
  };

  constructor(  private dialog: MatDialog,
                private billerCompanyService: BillerCompanyService) { }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
        const data = e.data;
        const actionType = e.event.target.getAttribute('data-action-type');

        switch (actionType) {
            case 'view':
                return this.onActionViewClick(data);
            case 'remove':
                return this.onActionRemoveClick(data);
        }
    }
  }

  public onActionViewClick(data: any) {
      console.log('View action clicked', data);
  }

  public onActionRemoveClick(data: any) {
      console.log('Remove action clicked', data);
  }


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
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
