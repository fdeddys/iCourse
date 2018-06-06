import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerDetail } from './biller-detail.model';
import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';
import { Product } from '../product';

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
    // filteredProduct: Observable<any[]>;

    billerDetail: BillerDetail;

    billerTypeList = [];
    billerCompanyList = [];
    productList = [];

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
        this.productList = this.data.productData;
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

    // getBillType(value) {
    //     this.productList = _.filter(this.productList, function(o) { return o.billerType.id === value.id; });
    //     console.log(this.productList);
    // }

    // getBillComp(value) {
    //     this.productList = _.filter(this.productList, function(o) { return o.billerType.id === value.id; });
    //     console.log(this.productList);
    // }

    closed(): void {
        console.log('close panel ', this.billTypeCtrl.value);
        if (this.billTypeCtrl.value === null && this.billCompanyCtrl.value !== null) {
            const idC = this.billCompanyCtrl.value.id;
            this.productList = _.filter(this.data.productData, function(o) { return o.billerCompany.id === idC; });
        } else if (this.billTypeCtrl.value !== null && this.billCompanyCtrl.value === null) {
            const idT = this.billTypeCtrl.value.id;
            this.productList = _.filter(this.data.productData, function(o) { return o.billerType.id === idT; });
        } else if (this.billTypeCtrl.value !== null && this.billCompanyCtrl.value !== null) {
            const idC = this.billCompanyCtrl.value.id;
            const idT = this.billTypeCtrl.value.id;
            this.productList = _.filter(this.data.productData, function(o) { return o.billerType.id === idT; });
            this.productList = _.filter(this.productList, function(o) { return o.billerCompany.id === idC; });
        }
        console.log(this.productList);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {
        console.log(this.billerDetail);
        this.dialogRef.close(this.billerDetail);
    }

}
