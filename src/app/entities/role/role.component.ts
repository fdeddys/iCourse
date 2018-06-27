import { Component, OnInit } from '@angular/core';
import { Role } from './role.model';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from './role.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { RoleDialogComponent } from './role-dialog.component';
import { RoleConfirmDialogComponent } from './role-confirm-dialog.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  theme: String = GRID_THEME;
  cssButton = CSS_BUTTON  ;
  role: Role[];
  Role: Role;
  messageNoData: string = NO_DATA_GRID_MESSAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'No',  field: 'nourut', width: 100, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', editable: false },
      { headerName: 'Description', field: 'description' },
      { headerName: ' ', width: 150, minWidth: 150, maxWidth: 150, cellRenderer: 'actionRenderer'}
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
                private roleService: RoleService) { }

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
          this.loadAll();
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

  loadAll() {
        console.log('Start call function all header');
        this.roleService.query({
            page: 1,
            count: 10000,
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
    params.api.sizeColumnsToFit();
    // console.log(this.gridApi);
    // console.log(this.gridColumnApi);
    // window.onresize = () => {
    //     console.log('resize..');
    //     this.gridApi.sizeColumnsToFit();
    // };

    this.loadAll();
  }

  openNewDialog(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'Role' }
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

    this.role = data.content;
    let urut = 1;
      for (const role of this.role) {
        role.nourut = urut++;
      }
      this.gridApi.setRowData(this.role);
  }

  private onError(error) {
    console.log('error..');
  }

}
