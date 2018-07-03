import { Component, OnInit } from '@angular/core';
import { Role } from './role.model';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from './role.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, REPORT_PATH} from '../../shared/constant/base-constant';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { RoleDialogComponent } from './role-dialog.component';
import { RoleConfirmDialogComponent } from './role-confirm-dialog.component';

import { MainChild, eventSubscriber } from '../../layouts/main/main-child.interface';
import { MainService } from '../../layouts/main/main.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements MainChild, OnInit {

  private gridApi;
  private gridColumnApi;
  private resourceUrl = REPORT_PATH;
  theme: String = GRID_THEME;
  cssButton = CSS_BUTTON  ;
  role: Role[];
  Role: Role;
  messageNoData: string = NO_DATA_GRID_MESSAGE;
  curPage = 1;
  totalData = 0;
  totalRecord = TOTAL_RECORD_PER_PAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'No',  field: 'nourut', width: 100, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', width: 200, editable: false },
      { headerName: 'Description', field: 'description', width: 500, },
      { headerName: ' ', width: 100, minWidth: 150, maxWidth: 150, cellRenderer: 'actionRenderer'}
      // { headerName: ' ', suppressMenu: true,
      //   suppressSorting: true,
      //   width: 100,
      //   template:
      //     `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
      //       Edit
      //     </button>
      //     ` }
    ],
      rowData: this.role,
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

  constructor(  private mainService: MainService,
                private dialog: MatDialog,
                private roleService: RoleService) {
                    this.resizeColumn = this.resizeColumn.bind(this);
                    eventSubscriber(mainService.subscription, this.resizeColumn);
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
      const dialogRef = this.dialog.open(RoleDialogComponent, {
        width: '1000px',
        data: { action: 'Edit', entity: 'Role', role: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        if (result === 'refresh') {
          this.loadAll(this.curPage);
        }
      });
  }

  public onActionRemoveClick(data: Role) {
      console.log('Remove action clicked', data);
      const biller: string = data.name;
      const dialogConfirm = this.dialog.open(RoleConfirmDialogComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
      });

      dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });

    }

  loadAll(page) {
        console.log('Start call function all header');
        this.roleService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
                (res: HttpResponse<Role[]>) => this.onSuccess(res.body, res.headers),
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
    this.gridApi.sizeColumnsToFit();

    window.onload = () => {
        console.log('resize..');
        this.gridApi.sizeColumnsToFit();
    };

    window.onresize = () => {
        console.log('resize..');
        this.gridApi.sizeColumnsToFit();
    };

    this.loadAll(this.curPage);
  }

  openNewDialog(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'Role' }
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

    this.role = data.content;
    let urut = 1;
      for (const role of this.role) {
        role.nourut = urut++;
      }
      this.gridApi.setRowData(this.role);
      this.totalData = data.totalElements;
  }

    private onError(error) {
        console.log('error..');
        this.gridApi.setRowData([]);
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        this.loadAll(this.curPage);
    }
  resizeColumn() {
    console.log('is resized?');
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 400);
  }

  public exportCSV(reportType): void {
    const path = this.resourceUrl  + 'role';
    window.open(`${path}/${reportType}`);
}


}
