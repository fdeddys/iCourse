import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerType } from './biller-type.model';
import { BillerTypeService } from './biller-type.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-biller-type-dialog',
    templateUrl: './biller-type-dialog.component.html',
    styleUrls: ['./biller-type-dialog.component.css']
})

export class BillerTypeDialogComponent implements OnInit {

    billerType: BillerType;
    name: string;
    checked = false;

    constructor(
        public billerTypeService: BillerTypeService,
        public dialogRef: MatDialogRef<BillerTypeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
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

    save(): void {
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

    onChange(events): void {
        console.log('event ', event);
    }

}
