import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerCompany } from '.';

@Component({
    selector: 'app-biller-company-dialog',
    templateUrl: './biller-company-dialog.component.html',
    styleUrls: []
})

export class BillerCompanyDialogComponent implements OnInit {

    billerCompany: BillerCompany;
    billerCompanies = [];

    constructor(public dialogRef: MatDialogRef<BillerCompanyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.billerCompany = {};
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
