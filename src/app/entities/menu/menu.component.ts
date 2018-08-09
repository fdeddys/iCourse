import { Component, OnInit, Input } from '@angular/core';
import { Menu } from './menu.model';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from './menu.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { MenuDialogComponent } from './menu-dialog.component';
import { MenuConfirmDialogComponent } from './menu-confirm-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input('editingRole') editingRole;

  private gridApi;
  private gridColumnApi;
  theme: String = GRID_THEME;
  cssButton = CSS_BUTTON  ;
  menu: Menu[];
  Menu: Menu;
  messageNoData: string = NO_DATA_GRID_MESSAGE;
  templateMenu;

  gridOptions = {
    columnDefs: [
      { headerName: 'No', field: 'nourut', width: 50, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', width: 100, editable: false },
      { headerName: 'Description', field: 'description',  editable: false },
      { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
      // { headerName: ' ', suppressMenu: true,
      // width: 100,
      // suppressSorting: true,
      // template:
      // `<button type="button" data-action-type="edit"  ${this.cssButton} >
      // Edit
      // </button>
      // ` }
    ],
    rowData: this.menu,
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

  ngOnInit() {
      // this.loadAll();
  }

  currencyFormatter(params): string {
    const dt  = new Date(params.value);
    return dt.toLocaleString(['id']);
  }

  constructor(  private dialog: MatDialog,
                private menuService: MenuService) { }

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
      const dialogRef = this.dialog.open(MenuDialogComponent, {
        width: '1000px',
        data: { action: 'Edit', entity: 'Menu', menu: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        if (result === 'refresh') {
          this.loadAll();
        }
      });
  }

  public onActionRemoveClick(data: Menu) {
      console.log('Remove action clicked', data);
      const biller: string = data.name;
      const dialogConfirm = this.dialog.open(MenuConfirmDialogComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
      });

      dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });

    }

  loadAll() {
        console.log('Start call function all header');
        this.menuService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<Menu[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
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
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'Menu' }
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

      this.menu = data.content;
      let urut = data.pageable.offset + 1;
      for (const mnu of this.menu) {
        mnu.nourut = urut++;
      }
      this.gridApi.setRowData(this.menu);
  }

  private onError(error) {
    console.log('error..');
  }

}
