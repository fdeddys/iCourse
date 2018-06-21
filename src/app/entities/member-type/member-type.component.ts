import { Component, OnInit } from '@angular/core';
import { MemberType } from './member-type.model';
import { MatDialog } from '@angular/material';
import { MemberTypeService } from './member-type.service';
import { MemberTypeDialogComponent } from './member-type-dialog.component';
import { MemberTypeConfirmComponent } from './member-type-confirm.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

@Component({
  selector: 'app-member-type',
  templateUrl: './member-type.component.html',
  styleUrls: ['./member-type.component.css']
})
export class MemberTypeComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  theme: String = GRID_THEME;
  cssButton = CSS_BUTTON  ;

  memberTipes: MemberType[];
  MemberType: MemberType;
  messageNoData: string = NO_DATA_GRID_MESSAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'No', field: 'nourut', width: 50, editable: false ,  pinned: 'left'},
      { headerName: 'Name', field: 'name', width: 100, editable: false},
      { headerName: 'Description', field: 'description',  editable: false },
      { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
      // { headerName: ' ', suppressMenu: true,
      //   width: 100 ,
      //   suppressSorting: true,
      //   template:
      //     `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
      //       Edit
      //     </button>
      //     ` }
    ],
      rowData: this.memberTipes,
      enableSorting: true,
      enableFilter: true,
      pagination: true,
      paginationPageSize: 10,
      cacheOverflowSize : 2,
      maxConcurrentDatasourceRequests : 2,
      infiniteInitialRowCount : 1,
      maxBlocksInCache : 2,
      localeText: {noRowsToShow: this.messageNoData},
      suppressHorizontalScroll: false,
      frameworkComponents: {
          actionRenderer: MatActionButtonComponent
      }
  };

  constructor(  private dialog: MatDialog,
                private memberTypeService: MemberTypeService) { }

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
      const dialogRef = this.dialog.open(MemberTypeDialogComponent, {
        width: '1000px',
        data: { action: 'EDIT', entity: 'Member Type', memberType: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        if (result === 'refresh') {
          this.loadAll();
        }
      });
  }

  public onActionRemoveClick(data: MemberType) {
      console.log('Remove action clicked', data);
      const member: string = data.name;
      const dialogConfirm = this.dialog.open(MemberTypeConfirmComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${member}` + '  ]  ?',  idCompanyMember: data.id }
      });

      dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });

    }

  loadAll() {
        console.log('Start call function all header');
        this.memberTypeService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<MemberType[]>) => this.onSuccess(res.body, res.headers),
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

  openNewDialog(): void {
    const dialogRef = this.dialog.open(MemberTypeDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'Member Type' }
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

      this.memberTipes = data.content;
      let urut = 1;
      for (const memberType of this.memberTipes) {
          memberType.nourut = urut++;
      }
      this.gridApi.setRowData(this.memberTipes);
  }

  private onError(error) {
    console.log('error..');
  }

}
