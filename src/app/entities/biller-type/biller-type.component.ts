import { Component, OnInit } from '@angular/core';
import { BillerType } from './biller-type.model';
import { MatDialog } from '@angular/material';
import { BillerTypeService } from './biller-type.service';
import { BillerTypeDialogComponent } from './biller-type-dialog.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BillerTypeConfirmComponent } from './biller-type-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

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

  gridOptions = {
      columnDefs: [
          { headerName: 'No', field: 'nourut', width: 50, pinned: 'left', editable: false },
          { headerName: 'Name', field: 'name', width: 200, editable: false },
          { headerName: 'Type', field: 'ispostpaid', valueFormatter: this.boolFormatter, width: 200, editable: false },
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
                private billerTypeService: BillerTypeService, ) { }

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
        if (result === 'refresh') {
          this.loadAll();
        }
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

  loadAll() {
      console.log('Start call function all header');
      this.billerTypeService.query({
          page: 1,
          count: 10000,
      })
      .subscribe(
              (res: HttpResponse<BillerType[]>) => this.onSuccess(res.body, res.headers),
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
      params.api.sizeColumnsToFit();

      console.log(this.gridApi);
      console.log(this.gridColumnApi);
      this.loadAll();
  }

  openNewDialog(): void {
      const dialogRef = this.dialog.open(BillerTypeDialogComponent, {
          width: '1000px',
          data: { action: 'Add', entity: 'Bill Type' }
      });

      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed = [', result, ']');
          if (result === 'refresh') {
              this.loadAll();
          }
      });
  }

  private onSuccess(data, headers) {
      if ( data.content.length <= 0 ) {
          return ;
      }

      this.billerTipes = data.content;
      let urut = 1;
      for (const billerType of this.billerTipes) {
          billerType.nourut = urut++;
      }
      this.gridApi.setRowData(this.billerTipes);
  }

  private onError(error) {
      console.log('error..');
  }

  public previewPdf(): void {
      this.preview('PDF');
  }

  public previewXls(): void {
      this.preview('XLS');
  }

  public preview(reportType): void {
      const path = this.resourceUrl  + 'billertype';
      window.open(`${path}/${reportType}`);
  }

}
