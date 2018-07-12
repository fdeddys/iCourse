import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { MemberDialogComponent } from './member-dialog.component';
import { MemberConfirmComponent } from './member-confirm.component';
import { Member } from './member.model';
import { MemberService } from './member.service';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { SharedService } from '../../shared/services/shared.service';
import { IFilter } from 'ag-grid';
import { Filter } from '../../shared/model/filter';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  // no: any;
  cssButton = CSS_BUTTON  ;
  theme: String = GRID_THEME;
  curPage = 1;
  totalData = 0;
  totalRecord = TOTAL_RECORD_PER_PAGE;
  private resourceUrl = REPORT_PATH;
  private filter: Filter = {
    name: null,
    description: null,
    active: 'ALL',
  };
  status: any;
  statusList = [];

  members: Member[];
  member: Member;
  messageNoData: string = NO_DATA_GRID_MESSAGE;

  gridOptions = {
    columnDefs: [
      { headerName: 'No', field: 'nourut', width: 100, pinned: 'left', editable: false  },
      { headerName: 'Name', field: 'name', width: 300, editable: false },
      { headerName: 'Description', field: 'description', width: 400, editable: false },
      { headerName: 'Status', field: 'active', width: 200,  editable: false },
      { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
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

  // boolFormatter(params): string {
  //   return params.value === true ? 'Active' : 'Inactive';
  // }
  constructor(  private dialog: MatDialog,
                private memberService: MemberService,
                private sharedService: SharedService) { }

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
        // if (result === 'refresh') {
          this.loadAll(this.curPage);
        // }
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

  loadAll(page) {
        console.log('Start call function all header');
        this.memberService.query({
            page: page,
            count: this.totalRecord,
            // size: this.itemsPerPage,
            // sort: this.sort()
        })
        .subscribe(
                (res: HttpResponse<Member[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    filterBtn(): void {
      let statusAll = false;
      switch (this.filter.active) {
        case 'ALL':
            console.log('hapus active');
            statusAll = true;
            // delete this.filter.active ;
            this.filter.active = null;
            break;
    //     case 'ACTIVE':
    //     // lastStatus = 'ACTIVE';
    //         this.filter.active = true;
    //         break;
    //     default:
    //         this.filter.active = null;
    //         break;
    }
    this.memberService.filter({
        page: this.curPage,
        count: this.totalRecord,
        filter: this.filter,
    })
    .subscribe(
        (res: HttpResponse<Member[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message),
        () => { console.log('finally');
                if ( statusAll ) {
                  this.filter.active = 'ALL';
                }
              }
      );
    }

  ngOnInit() {
    // this.loadAll();
    // this.no = 0;
    this.loadStatus();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    console.log(this.gridApi);
    console.log(this.gridColumnApi);

    this.loadAll(this.curPage);
    // params.api.sizeColumnsToFit();
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
      // if (result === 'refresh') {
        this.loadAll(this.curPage);
      // }
    });
  }

  private onSuccess(data, headers) {
      if ( data.content.length < 0 ) {
          return ;
      }
      this.members = data.content;
      let urut = 1;
      for (const member of this.members) {
          member.nourut = urut++;
      }
      this.gridApi.setRowData(this.members);
      this.totalData = data.totalElements;
  }

  private onError(error) {
      console.log('error..');
  }

  // public nextPage(): void {
  //     this.loadAll(this.curPage + 1 );
  // }

  // public prevPage(): void {
  //     this.loadAll(this.curPage - 1 );
  // }

  // public firstPage(): void {
  //     this.loadAll( 1 );
  // }

  // public lastPage(): void {
  //     this.loadAll(this.totalpage );
  // }

  public onPaginateChange($event): void {
      // console.log('events ', $event);
      this.curPage = $event.pageIndex + 1;
      this.loadAll(this.curPage);
  }

    public async exportCSV(reportType): Promise<void> {

       const blob = await this.memberService.exportCSV();
       const url = window.URL.createObjectURL(blob);
       const link = document.createElement('a');
       document.body.appendChild(link);
       link.setAttribute('style', 'display: none');
       link.href = url;
       link.download = 'member.csv';
       link.click();
       link.remove();

       window.URL.revokeObjectURL(url);
   }

    loadStatus(): void {
      this.sharedService.getStatus()
      .subscribe(
          (res) => {
              this.statusList = [];

              // this.statusList.push(res.body);
              this.statusList.push('ALL');
              // this.statusList.push('false');
              // res.body.forEach(function(data) {
              //   console.log('isi ==>', data);
              //   this.statusList.push(data);
              // });
              for (const datas of res.body) {
                console.log(datas);
                this.statusList.push(datas);
              }
          },
          (res: HttpErrorResponse) => this.onError(res.message),
          () => { console.log('finally'); }
      );
    }

}
