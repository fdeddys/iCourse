import { Component, OnInit } from '@angular/core';
import { GlobalSetting } from './global-setting.model';
import { MatDialog } from '@angular/material';
import { GlobalSettingService } from './global-setting.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GlobalSettingDialogComponent } from './global-setting-dialog.component';
import { GlobalSettingConfirmComponent } from './global-setting-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';

@Component({
  selector: 'app-global-setting',
  templateUrl: './global-setting.component.html',
  styleUrls: ['./global-setting.component.css']
})
export class GlobalSettingComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  cssButton = CSS_BUTTON  ;
  theme: String = GRID_THEME;

  memberTipes: GlobalSetting[];
  GlobalSetting: GlobalSetting;
  messageNoData: string = NO_DATA_GRID_MESSAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'No', field: 'nourut', width: 10, pinned: 'left', editable: false },
      { headerName: 'Type', field: 'globalType', width: 20, editable: false },
      { headerName: 'Name', field: 'name', width: 20, editable: false },
      { headerName: 'Description', field: 'description', width: 30, editable: false },
      // { headerName: 'Created at', field: 'createdAt', width: 200, valueFormatter: this.currencyFormatter },
      // { headerName: 'Update at', field: 'updatedAt', width: 200, valueFormatter: this.currencyFormatter },
      // { headerName: 'Created By', field: 'createdBy', width: 200 },
      // { headerName: 'Updated By', field: 'updatedBy', width: 200 },
      { headerName: ' ', suppressMenu: true,
        width: 20,
        suppressSorting: true,
        template:
          `<button mat-raised-button type="button" data-action-type="edit" ${this.cssButton} >
            Edit
          </button>
          ` }
    ],
      rowData: this.memberTipes,
      enableSorting: true,
      enableFilter: true,
      pagination: true,
      paginationPageSize: 10,
      // cacheOverflowSize : 2,
      // maxConcurrentDatasourceRequests : 2,
      // infiniteInitialRowCount : 1,
      // maxBlocksInCache : 2,
      localeText: {noRowsToShow: this.messageNoData},
  };


  currencyFormatter(params): string {
    const dt  = new Date(params.value);
    return dt.toLocaleString(['id']);
  }

  constructor(  private dialog: MatDialog,
                private globalSettingService: GlobalSettingService) { }

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
      const dialogRef = this.dialog.open(GlobalSettingDialogComponent, {
        width: '1000px',
        data: { action: 'Edit', entity: 'Member Type', globalSetting: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        if (result === 'refresh') {
          this.loadAll();
        }
      });
  }

  public onActionRemoveClick(data: GlobalSetting) {
      console.log('Remove action clicked', data);
      const member: string = data.name;
      const dialogConfirm = this.dialog.open(GlobalSettingConfirmComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${member}` + '  ]  ?',  idCompanyMember: data.id }
      });

      dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });

    }

  loadAll() {
        console.log('Start call function all header');
        this.globalSettingService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<GlobalSetting[]>) => this.onSuccess(res.body, res.headers),
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
    const dialogRef = this.dialog.open(GlobalSettingDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'Global Setting' }
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
        // this.memberTipes = null;
        // this.gridApi.setRowData(this.memberTipes);
        // return ;
      } else {
        this.memberTipes = data.content;
        let urut = 1;
        for (const memberType of this.memberTipes) {
            memberType.nourut = urut++;
        }
        this.gridApi.setRowData(this.memberTipes);
      }
  }

  private onError(error) {
    console.log('error..');
  }


}
