import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { MemberDialogComponent } from './member-dialog.component';
import { MemberConfirmComponent } from './member-confirm.component';
import { Member } from './member.model';
import { MemberService } from './member.service';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  cssButton = CSS_BUTTON  ;
  theme: String = GRID_THEME;

  members: Member[];
  member: Member;
  messageNoData: string = NO_DATA_GRID_MESSAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'id', field: 'id', width: 50, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', width: 150, editable: false },
      { headerName: 'Description', field: 'description', width: 200, editable: false },
      { headerName: 'Active', field: 'active', width: 100, editable: false, valueFormatter: this.boolFormatter },
      { headerName: ' ', suppressMenu: true,
        suppressSorting: true,
        template:
          `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
            Edit
          </button>` }
    ],
      rowData: this.members,
      enableSorting: true,
      enableFilter: true,
      pagination: true,
      paginationPageSize: 10,
      cacheOverflowSize : 2,
      maxConcurrentDatasourceRequests : 2,
      infiniteInitialRowCount : 1,
      maxBlocksInCache : 2,
      onPaginationChanged: this.onPaginationChanged(),
      localeText: {noRowsToShow: this.messageNoData},
  };

  currencyFormatter(params): string {
    const dt  = new Date(params.value);

    return dt.toLocaleString(['id']);
  }

  boolFormatter(params): string {
    return params.value === true ? 'Ya' : 'Tidak';
  }
  constructor(  private dialog: MatDialog,
                private memberService: MemberService) { }

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
      const dialogRef = this.dialog.open(MemberDialogComponent, {
        width: '1000px',
        data: { action: 'Edit', entity: 'Member Registration', member: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed = [', result, ']');
        if (result === 'refresh') {
          this.loadAll();
        }
      });
  }

  public onActionRemoveClick(data: Member) {
      console.log('Remove action clicked', data);
      const biller: string = data.name;
      const dialogConfirm = this.dialog.open(MemberConfirmComponent, {
        width: '50%',
        data: { warningMessage: 'Apakah anda yakin untuk menonaktifkan [  ' + `${biller}` + '  ]  ?',  idCompanyBiller: data.id }
      });

      dialogConfirm.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });

    }

  loadAll() {
        console.log('Start call function all header');
        this.memberService.query({
            page: 1,
            count: 10000,
            // size: this.itemsPerPage,
            // sort: this.sort()
        })
        .subscribe(
                (res: HttpResponse<Member[]>) => this.onSuccess(res.body, res.headers),
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
    params.api.sizeColumnsToFit();
  }

  onPaginationChanged() {
    console.log('onPaginationPageLoaded');

    // Workaround for bug in events order
    if (this.gridApi) {
    }
}

  openNewDialog(): void {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '1000px',
      data: { action: 'Add', entity: 'Member Registration' }
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

      this.members = data.content;
      this.gridApi.setRowData(this.members);

  }

  private onError(error) {
    console.log('error..');
  }

}
