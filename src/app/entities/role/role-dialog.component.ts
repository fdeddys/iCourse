import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-role-dialog',
    templateUrl: './role-dialog.component.html',
    styleUrls: ['./role-dialog.component.css']
})

export class RoleDialogComponent implements OnInit {

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);

    role: Role;

    constructor(
        public roleService: RoleService,
        public dialogRef: MatDialogRef<RoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.role = {};
        if ( this.data.action === 'EDIT' ) {
            // search
            console.log('id sending ', this.data.role);
            this.role = this.data.role;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {

        console.log('isi object  ', this.role);
        if (this.role.id === undefined) {
            console.log('send to service ', this.role);
            this.roleService.create(this.role).subscribe((res: HttpResponse<Role>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.role);
            this.roleService.update(this.role.id, this.role).subscribe((res: HttpResponse<Role>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

}
