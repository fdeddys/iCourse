import { Component, OnInit, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerDetail } from './biller-detail.model';
import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';

@Component({
    selector: 'app-biller-detail',
    templateUrl: './biller-detail.component.html',
    styleUrls: ['./biller-detail.component.css']
})
export class BillerDetailComponent implements OnInit {

    billTypeCtrl: FormControl;
    filteredBillType: Observable<any[]>;
    billCompanyCtrl: FormControl;
    filteredBillCompany: Observable<any[]>;

    billerDetail: BillerDetail;

    billerTypeList = [];
    billerCompanyList = [];

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<BillerDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.billTypeCtrl = new FormControl();
        this.filteredBillType = this.billTypeCtrl.valueChanges
        .pipe(
            // startWith(''),
            // map(billerType => billerType ? this.filterBillType(billerType) : this.billerTypeList.slice())
            startWith<string | BillerType>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterBillType(name) : this.billerTypeList.slice())
        );

        this.billCompanyCtrl = new FormControl();
        this.filteredBillCompany = this.billCompanyCtrl.valueChanges
        .pipe(
            // startWith(''),
            // map(billerCompany => billerCompany ? this.filterBillCompany(billerCompany) : this.billerCompanyList.slice())
            startWith<string | BillerCompany>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterBillCompany(name) : this.billerCompanyList.slice())
        );
    }

    ngOnInit() {
        this.billerDetail = {};
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
    }

    filterBillType(name: string) {
        return this.billerTypeList.filter(billerType =>
        billerType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterBillCompany(name: string) {
        return this.billerCompanyList.filter(billerCompany =>
        billerCompany.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnBil(billerType?: BillerType): string | undefined {
        return billerType ? billerType.name : undefined;
    }

    displayFnCom(billerCompany?: BillerCompany): string | undefined {
        return billerCompany ? billerCompany.name : undefined;
    }

    getBillType(value) {
        console.log(value);
        // return this.billerCompanyList.filter(billerCompany =>
        // billerCompany.billerType.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    getBillComp(value) {
        console.log(value);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
