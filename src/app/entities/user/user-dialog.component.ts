import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { User } from './user.model';
import { UserService } from './user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Role, RoleService } from '../role';
import { NO_DATA_GRID_MESSAGE, GRID_THEME, CSS_BUTTON, SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { RoleUserService } from '../role-user/role-user.service';
import { RoleUserView } from '../role-user/role-user.model';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { MatActionDeleteButtonComponent } from '../../shared/templates/mat-action-delete-button.component';
import { TranslateService } from '@ngx-translate/core';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

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
    userForm: FormGroup;
    submitted = false;
    enableAddRole = true;
    newpass = {
        resetPass : null
    };
    isReset = false;

    // emailFormControl = new FormControl('', [
    //     Validators.required,
    //     Validators.email,
    //   ]);

    user: User;

    statuses = [
        {value: 'ACTIVE', viewValue: 'ACTIVE'},
        {value: 'INACTIVE', viewValue: 'INACTIVE'}
    ];

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        public userService: UserService,
        public snackBar: MatSnackBar,
        public roleService: RoleService,
        private roleUserService: RoleUserService,
        public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            translate.use('en');
        }

    gridOptions = {
        columnDefs: [
            // { headerName: 'id', field: 'roleId', width: 50, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'roleName', width: 200, editable: false },
            { headerName: 'Description', field: 'roleDescription', width: 200, editable: false },
            // { headerName: 'Status', field: 'status', width: 100, editable: false },
            // { headerName: ' ', suppressMenu: true,
            // suppressSorting: true,
            // width: 100,
            // template:
            //     `<button mat-raised-button type="button" data-action-type="removeRole"  ${this.cssButton} >
            //     Change
            //     </button>
            //     ` }
            { headerName: 'Status', field: 'status', width: 150, cellRenderer: 'actionRenderer'}
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
            frameworkComponents: {
                actionRenderer: MatActionDeleteButtonComponent,
            }
        };

    public onCellClicked(e) {
        console.log('clicked cell ', e);
        if (e.event.target !== undefined) {
            const data = e.data;
            const colField = e.colDef.field;

            switch (colField) {
                case 'status':
                    // console.log('Send data ==> ', data);
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
                    const decodePass = atob(res.body.oldPass);
                    this.isReset = true;
                    this.snackBar.open('Password has been reset  ', 'ok', { duration: this.duration, });
                    this.newpass.resetPass = decodePass;
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
        this.userService.removeRole(this.user.id, data.roleId )
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
        this.userForm = this.formBuilder.group({
             name: ['', [CommonValidatorDirective.required ]],
             email: ['', CommonValidatorDirective.required],
             firstName: ['', CommonValidatorDirective.required],
             lastName: ['', CommonValidatorDirective.required],
             // status: ['', CommonValidator.required]
         });

        this.user = {};
        if ( this.data.action === 'Edit' ) {
            // search
            console.log('id sending ', this.data.user);
            this.user = this.data.user;
        } else {
            this.user.status = 1;
        }
    }

    get form() { return this.userForm.controls; }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        // if ( this.data.action === 'Add' ) {

        //     if ( this.pass === '' ) {
        //         this.snackBar.open('Password belum di isi !', 'ok', {
        //             duration: 2000,
        //         });
        //         return ;
        //     }

        //     if ( this.pass !== this.confirmP ) {
        //         this.snackBar.open('Password dan confirmasi tidak sama !', 'ok', {
        //             duration: 2000,
        //         });
        //         return ;
        //     }
        //     this.user.password = atob(this.pass);
        // }

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
                        this.isReset = true;
                        this.snackBar.open('Password has been generated  ', 'ok', { duration: this.duration, });
                        this.newpass.resetPass = decodePass;
                        // this.snackBar.open('Password  [ ' + decodePass + ' ] WITHOUT BRACKET ! ', 'ok');
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

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.userForm.invalid) {
            return;
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
        if  (this.user.id === undefined) {
            console.log('User id not found');
            this.roleRegisterd = [];
            this.gridApi.setRowData(this.roleRegisterd);
            return null;
        }

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
        if ( data.length > 0 ) {
            this.enableAddRole = false;
            console.log('data role leng ==> ', data.length);
        } else {
            this.enableAddRole = true;
        }
        // enableAddRole
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
