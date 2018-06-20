import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';
import { UserDialogComponent } from './user-dialog.component';
import { UserConfirmDialogComponent } from './user-confirm-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  theme: String = GRID_THEME;
  cssButton = CSS_BUTTON  ;
  user: User[];
  User: User;
  messageNoData: string = NO_DATA_GRID_MESSAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'No', field: 'nourut', width: 30, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', width: 80, editable: false },
      { headerName: 'Email', field: 'email', editable: false },
      { headerName: 'Status', field: 'status',  width: 80, editable: false, valueFormatter: this.boolFormatter },
      { headerName: ' ', suppressMenu: true,
        width: 100,
        suppressSorting: true,
        template:
          `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
            Edit
          </button>
          ` }
    ],
      rowData: this.user,
      enableSorting: true,
      enableFilter: true,
      pagination: true,
      paginationPageSize: 10,
      cacheOverflowSize : 2,
      maxConcurrentDatasourceRequests : 2,
      infiniteInitialRowCount : 1,
      maxBlocksInCache : 2,
      localeText: {noRowsToShow: this.messageNoData},
  };

  boolFormatter(params): string {
    return params.value === 1 ? 'ACTIVE' : 'INACTIVE';
  }

  currencyFormatter(params): string {
    const dt  = new Date(params.value);
    return dt.toLocaleString(['id']);
  }

  constructor(  private dialog: MatDialog,
                private userService: UserService) { }

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
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '1000px',
        data: { action: 'Edit', entity: 'User', user: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        if (result === 'refresh') {
          this.loadAll();
        }
      });
  }

  public onActionRemoveClick(data: User) {
      console.log('Remove action clicked', data);
      const biller: string = data.name;
      const dialogConfirm = this.dialog.open(UserConfirmDialogComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
      });

      dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });

    }

  loadAll() {
        console.log('Start call function all header');
        this.userService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<User[]>) => this.onSuccess(res.body, res.headers),
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
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'User' }
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
      this.user = data.content;
      let urut = 1;
      for (const usr of this.user) {
        usr.nourut = urut++;
      }
      this.gridApi.setRowData(this.user);
  }

  private onError(error) {
    console.log('error..');
  }

}
