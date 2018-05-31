import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerCompany } from './biller-company.model';
import { BillerCompanyService } from './biller-company.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-biller-company-dialog',
    templateUrl: './biller-company-dialog.component.html',
    styleUrls: ['./biller-company-dialog.component.css']
})

export class BillerCompanyDialogComponent implements OnInit {

    billerCompany: BillerCompany;
    name: string;

    constructor(
        public billerCompanyService: BillerCompanyService,
        public dialogRef: MatDialogRef<BillerCompanyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.billerCompany = {};
        if ( this.data.action === 'EDIT' ) {
            // search
            this.billerCompany = this.data.billerCompany;
            this.name = this.billerCompany.name;
        }

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {
        console.log('isi biller = ', this.billerCompany);
        // this.billerCompany.name = this.name;

        console.log('isi biller company ', this.billerCompany);
        if (this.billerCompany.id === undefined) {
            console.log('send to service ', this.billerCompany);
            this.billerCompanyService.save(this.billerCompany).subscribe((res: HttpResponse<BillerCompany>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

}
