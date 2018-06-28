import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { User } from './user.model';
import { UserService } from './user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Role, RoleService } from '../role';
import { NO_DATA_GRID_MESSAGE, GRID_THEME, CSS_BUTTON, SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { RoleUserService } from '../role-user/role-user.service';
import { RoleUserView } from '../role-user/role-user.model';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.css']
})

export class UserDialogComponent implements OnInit {

    confirmP = '';
    pass = '';
    private gridApi;
    private gridColumnApi;

    roleRegisterd: Role[];
    roleList: Role[];
    roleSelected: Role;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);

    user: User;

    statuses = [
        {value: 1, viewValue: 'Active'},
        {value: 0, viewValue: 'Inactive'}
    ];

    constructor(
        public userService: UserService,
        public snackBar: MatSnackBar,
        public roleService: RoleService,
        private roleUserService: RoleUserService,
        public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    gridOptions = {
        columnDefs: [
            // { headerName: 'id', field: 'roleId', width: 50, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'roleName', width: 200, editable: false },
            { headerName: 'Description', field: 'roleDescription', width: 200, editable: false },
            { headerName: 'Status', field: 'status', width: 100, editable: false },
            { headerName: ' ', suppressMenu: true,
            suppressSorting: true,
            width: 100,
            template:
                `<button mat-raised-button type="button" data-action-type="removeRole"  ${this.cssButton} >
                Change
                </button>
                ` }
        ],
            rowData: this.roleRegisterd,
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

    public onRowClicked(e) {
        console.log('clicked ', e);
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

            switch (actionType) {
                case 'removeRole':
                    console.log('Send data ==> ', data);
                    return this.onActionClick(data);
            }
        }
    }

    addRole(): void {
        console.log('user ==> ', this.user, 'role ==> ', this.roleSelected );
        this.userService.addRole(this.user.id, this.roleSelected.id )
            .subscribe(
                () => {
                    this.roleSelected = null;
                    this.getRoleRegistered();
                    this.snackBar.open('Role success registerd !', 'ok', {
                        duration: this.duration,
                    });
                    // this.loadMenuRegistered(this.role.id);
                },
                (msg: HttpErrorResponse) => {
                    console.log(msg);
                    this.snackBar.open('Error :  ' +  msg.error.name + ' !', 'ok', {
                        duration: this.duration,
                    });
                }
            );
    }

    resetPassword(): void {
        this.userService.resetPassword(this.user.id )
        .subscribe(
            (res: HttpResponse<User>) => {
                if (res.body.errMsg === null || res.body.errMsg === '' ) {
                    const decodePass = atob(res.body.password);
                    this.snackBar.open('Password reset to [ ' + decodePass + ' ] WITHOUT BRACKET ! ', 'ok');
                } else {
                    this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
                // this.loadMenuRegistered(this.role.id);
            },
            (msg: HttpErrorResponse) => {
                console.log(msg);
                this.snackBar.open('Error :  ' +  msg.error.name + ' !', 'ok', {
                    duration: this.duration,
                });
            }
        );
    }

    onActionClick(data): void {
        console.log('role id' , this.user , '-Change-role id ', data);
        this.userService.changeStatusRole(this.user.id, data.roleId )
            .subscribe(
                () => {
                    this.getRoleRegistered();
                    // this.loadMenuRegistered(this.role.id);
                },
                (msg: HttpErrorResponse) => {
                    console.log(msg);
                    this.snackBar.open('Error :  ' +  msg.error.name + ' !', 'ok', {
                        duration: this.duration,
                    });
                }
            );
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll();
        console.log('Get all data');
        this.getRoleList();
        this.getRoleRegistered();
        // if ( this.role.id !== undefined ) {
        //     this.loadMenuRegistered(this.role.id);
        // }
        // this.loadMenuList(this.role.id, false);
    }

    ngOnInit() {
        this.user = {};
        if ( this.data.action === 'Edit' ) {
            // search
            console.log('id sending ', this.data.user);
            this.user = this.data.user;
        } else {
            this.user.status = 1;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {

        this.user.password = '';

        // console.log('isi object  ', this.user);
        if (this.user.id === undefined) {
            console.log('send to service ', this.user);
            this.userService.create(this.user).subscribe(
                (res: HttpResponse<User>) => {
                    if (res.body.errMsg === null || res.body.errMsg === '' ) {
                        const decodePass = atob(res.body.password);
                        this.data.action = 'Edit';
                        this.user.id = res.body.id;
                        this.snackBar.open('Password  [ ' + decodePass + ' ] WITHOUT BRACKET ! ', 'ok');
                    } else {
                        this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
                            duration: this.duration,
                        });
                    }
                // this.dialogRef.close('refresh');
                },
                (res: HttpErrorResponse) => {
                    this.snackBar.open('Error !' + res.error.message , 'Close', {
                        duration: this.duration,
                    });
                    console.log('error msh ', res.error.message);
                }
            );
        } else {
            console.log('send to service ', this.user);
            this.userService.update(this.user.id, this.user).subscribe(
                (res: HttpResponse<User>) => {
                    // this.dialogRef.close('refresh');
                    if (res.body.errMsg === null || res.body.errMsg === '' ) {
                        this.snackBar.open('Data updated ', 'ok', {
                            duration: this.duration,
                        });
                    } else {
                        this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
                            duration: this.duration,
                        });
                    }
                },
                (res: HttpErrorResponse) => {
                    this.snackBar.open('Error !' + res.error.message , 'Close', {
                        duration: 10000,
                    });
                    console.log('error msh ', res.error.message);
                }
            );
        }
    }

    getRoleList(): void {
        this.roleService.query({
            page: 1,
            count: 10000,
        }).subscribe(
            (res: HttpResponse<User[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {  }
        );
    }

    getRoleRegistered(): void {
        this.roleUserService.query(this.user.id)
            .subscribe(
                (res: HttpResponse<RoleUserView[]>) => this.onSuccessUserRole(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => {  }
            );
    }

    private onSuccess(data, headers) {
        if ( data.content.length <= 0 ) {
            return ;
        }
        this.roleList = data.content;
        this.roleSelected = this.roleList[0];
    }

    private onSuccessUserRole(data, headers) {

        // if (data.content ===  null) {
        //     return ;
        // }

        // if ( data.content.length <= 0 ) {
        //     return ;
        // }
        this.roleRegisterd = data;
        this.gridApi.setRowData(this.roleRegisterd);
        console.log('isi list dari user role', this.roleRegisterd);
        // this.roleSelected = this.roleList[0];
    }

    private onError(error) {
      console.log('error get all list role..');
    }

    closeForm(): void {
        this.dialogRef.close('refresh');
    }

}
