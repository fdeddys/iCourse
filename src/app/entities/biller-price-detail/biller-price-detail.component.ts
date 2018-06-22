import { Component, OnInit, Inject } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerPriceDetail } from './biller-price-detail.model';
import { BillerPriceDetailService } from './biller-price-detail.service';

import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';
import { Product } from '../product';

@Component({
    selector: 'app-biller-price-detail',
    templateUrl: './biller-price-detail.component.html',
    styleUrls: ['./biller-price-detail.component.css']
})
export class BillerPriceDetailComponent implements OnInit {

    billTypeCtrl: FormControl;
    filteredBillType: Observable<any[]>;
    billCompanyCtrl: FormControl;
    filteredBillCompany: Observable<any[]>;
    dateSCtrl: FormControl;
    dateTCtrl: FormControl;

    billerPriceDetail: BillerPriceDetail;

    billerTypeList = [];
    billerCompanyList = [];
    productList = [];

    minDate = new Date(2000, 0, 1);
    maxDate = new Date(2020, 0, 1);
    mode = 'Add';

    constructor(
        private dialog: MatDialog,
        public billerPriceDetailService: BillerPriceDetailService,
        public dialogRef: MatDialogRef<BillerPriceDetailComponent>,
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

        this.dateSCtrl = new FormControl();
        this.dateTCtrl = new FormControl();
    }

    ngOnInit() {
        this.billerPriceDetail = {};
        this.billerPriceDetail.billerHeaderId = this.data.rowData.billerHeaderId;
        console.log(this.data.mode);
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            console.log(this.data.rowData);
            this.mode = 'Edit';
            this.billerPriceDetail = {
                id: this.data.rowData.id,
                salesPrice: this.data.rowData.salesPrice,
                profit: this.data.rowData.profit,
                profitDistributorPks: this.data.rowData.profitDistributorPks,
                profitMemberPks: this.data.rowData.profitMemberPks,
                billerHeaderId: this.data.rowData.billerHeader.id,
                billerProductId: this.data.rowData.billerProduct.id
            };
            this.billTypeCtrl.setValue(this.data.rowData.billerProduct.billerType);
            this.billCompanyCtrl.setValue(this.data.rowData.billerProduct.billerCompany);
            this.dateSCtrl.setValue(this.data.rowData.dateStart);
            this.dateTCtrl.setValue(this.data.rowData.dateThru);
        }
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

    getBillType(value) {
        console.log(value);
        // return this.billerCompanyList.filter(billerCompany =>
        // billerCompany.billerType.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    getBillComp(value) {
        console.log(value);
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type === 'start') {
            this.billerPriceDetail.dateStart = event.value.toDateString();
        } else if (type === 'thru') {
            this.billerPriceDetail.dateThru = event.value.toDateString();
        }
    }

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
        console.log(this.billerPriceDetail);
        this.billerPriceDetail.dateStart = this.dateSCtrl.value;
        this.billerPriceDetail.dateThru = this.dateTCtrl.value;
        const varBack = {
            mode: this.data.mode,
            rowData: {}
        };
        // this.dialogRef.close(this.billerPriceDetail);

        if (this.billerPriceDetail.id === undefined || this.billerPriceDetail.id === null) {
            console.log('send to service ', this.billerPriceDetail);
            this.billerPriceDetailService.create(this.billerPriceDetail).subscribe((res: HttpResponse<BillerPriceDetail>) => {
                this.dialogRef.close(varBack);
            });
        } else {
            console.log('send to service ', this.billerPriceDetail);
            this.billerPriceDetailService.update(this.billerPriceDetail.id, this.billerPriceDetail)
            .subscribe((res: HttpResponse<BillerPriceDetail>) => {
                this.dialogRef.close(varBack);
            });
        }
    }

}
