import { Component, OnInit, Inject } from '@angular/core';
 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MemberType } from './member-type.model';
import { MemberTypeService } from './member-type.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonValidator } from '../../validators/common.validator';

@Component({
    selector: 'app-member-type-dialog',
    templateUrl: './member-type-dialog.component.html',
    styleUrls: ['./member-type-dialog.component.css']
})

export class MemberTypeDialogComponent implements OnInit {

    memberType: MemberType;
    memberTypeForm : FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        public memberTypeService: MemberTypeService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<MemberTypeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.memberTypeForm = this.formBuilder.group({ 
            name: ['', [CommonValidator.required]],
            description: ['', CommonValidator.required]
        });

        this.memberType = {};
        if ( this.data.action === 'EDIT' ) {
            // search
            console.log('member type id sending ', this.data.memberType);
            this.memberType = this.data.memberType;
        }
    }

    get form() { return this.memberTypeForm.controls; }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
     
        console.log('isi member  ', this.memberType);
        if (this.memberType.id === undefined) {
            console.log('send to service ', this.memberType);
            this.memberTypeService.create(this.memberType).subscribe((res: HttpResponse<MemberType>) => {

                this.openSnackbar();
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.memberType);
            this.memberTypeService.update(this.memberType.id, this.memberType).subscribe((res: HttpResponse<MemberType>) => {
                this.openSnackbar();
                this.dialogRef.close('refresh');
            });
        }
    }

    validate(): void { 
        this.submitted = true; 
        // stop here if form is invalid
        if (this.memberTypeForm.invalid) {
            return;
        }  
    }

    openSnackbar(): void {
        this.snackBar.open('Save success', 'ok', {
            duration: 2000,
        });
    }
}
