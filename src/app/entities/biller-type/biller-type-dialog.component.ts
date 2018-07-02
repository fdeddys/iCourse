import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerType } from './biller-type.model';
import { BillerTypeService } from './biller-type.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidator } from '../../validators/common.validator';

@Component({
    selector: 'app-biller-type-dialog',
    templateUrl: './biller-type-dialog.component.html',
    styleUrls: ['./biller-type-dialog.component.css']
})

export class BillerTypeDialogComponent implements OnInit {

    billerType: BillerType;
    name: string;
    checked = false;
    billerTypeForm : FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        public billerTypeService: BillerTypeService,
        public dialogRef: MatDialogRef<BillerTypeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.billerTypeForm.controls; }

    ngOnInit() {
        this.billerTypeForm = this.formBuilder.group({ 
            name: ['', [CommonValidator.required]], 
        });
        this.billerType = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.billerType = this.data.BillerType;
            this.name = this.billerType.name;
            this.checked =  this.billerType.ispostpaid;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        // this.billerType.ispostpaid = this.checked  ;
        console.log('isi biller = ', this.billerType);
        // this.BillerType.name = this.name;
        console.log('isi biller company ', this.billerType);
        if (this.billerType.id === undefined) {
            console.log('send to service ', this.billerType);
            this.billerTypeService.create(this.billerType).subscribe((res: HttpResponse<BillerType>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.billerType);
            this.billerTypeService.update(this.billerType.id, this.billerType).subscribe((res: HttpResponse<BillerType>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

    
    validate(): void { 
        this.submitted = true; 
        // stop here if form is invalid
        if (this.billerTypeForm.invalid) {
            return;
        }  
    }

    onChange(events): void {
        console.log('event ', event);
    }

}
