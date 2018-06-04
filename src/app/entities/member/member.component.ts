import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { MemberDialogComponent } from './member-dialog.component';
import { MemberConfirmComponent } from './member-confirm.component';
import { Member } from './member.model';
import { MemberService } from './member.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  members: Member[];
  member; Member;

  gridOptions = {
    columnDefs: [
      { headerName: 'id', field: 'id', width: 250, pinned: 'left', editable: false },
      { headerName: 'Name', field: 'name', width: 250, editable: false },
      { headerName: 'Description', field: 'description', width: 250, editable: false },
      { headerName: 'Active', field: 'active', width: 250, editable: false },
      { headerName: 'Created at', field: 'createdAt', width: 250, valueFormatter: this.currencyFormatter },
      { headerName: 'Update at', field: 'updatedAt', width: 250, valueFormatter: this.currencyFormatter },
      { headerName: 'Created By', field: 'createdBy', width: 250 },
      { headerName: 'Updated By', field: 'updatedBy', width: 250 },
      { headerName: 'action', suppressMenu: true,
        suppressSorting: true,
        template:
          `<button mat-raised-button type="button" data-action-type="edit" >
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
      onPaginationChanged: this.onPaginationChanged()
  };

  currencyFormatter(params): string {
    const dt  = new Date(params.value);

    return dt.toLocaleString(['id']);
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
        data: { action: 'EDIT', entity: 'Biller Company', member: data }
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
