import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerDetail } from './biller-detail.model';
import { BillerDetailService } from './biller-detail.service';
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

    statusData = true;
    mode = 'Add';

    constructor(
        private dialog: MatDialog,
        public billerDetailService: BillerDetailService,
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
        this.billerDetail.billerHeaderId = this.data.rowData.billerHeaderId;
        if (this.data.mode !== 'create') {
            console.log(this.data.rowData);
            this.mode = 'Edit';
            this.billerDetail = {
                id : this.data.rowData.id,
                externalCode : this.data.rowData.externalCode,
                buyPrice : this.data.rowData.buyPrice,
                fee : this.data.rowData.fee,
                profit : this.data.rowData.profit,
                sellPrice : this.data.rowData.sellPrice,
                billerHeaderId : this.data.rowData.billerHeader.id,
                billerProductId : this.data.rowData.billerProduct.id,
                postPaid : this.data.rowData.postPaid,
                status : this.data.rowData.status
            };
            this.statusData = (this.data.rowData.status === 'ACTIVE' ? true : false);

            this.billTypeCtrl.setValue(this.data.rowData.billerProduct.billerType);
            this.billCompanyCtrl.setValue(this.data.rowData.billerProduct.billerCompany);
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
        this.billerDetail.status = (this.statusData ? 'ACTIVE' : 'INACTIVE');
        this.billerDetail.sellPrice = this.billerDetail.buyPrice + this.billerDetail.fee;
        this.billerDetail.externalCode = '';
        this.billerDetail.postPaid = 1;
        const varBack = {
            mode: this.data.mode,
            rowData: {}
        };

        if (this.billerDetail.id === undefined || this.billerDetail.id === null) {
            console.log('send to service ', this.billerDetail);
            // direct save
            this.billerDetailService.create(this.billerDetail).subscribe((res: HttpResponse<BillerDetail>) => {
                this.dialogRef.close(varBack);
            });

            // indirect save
            // const idPrd = this.billerDetail.billerProductId;
            // varBack.rowData = {
            //     // id : this.data.rowData.id,
            //     // billerProduct : _.find(this.productList, function(o) { return o.id === idPrd; }),
            //     // billerHeader : this.data.rowData.billerHeader,
            //     externalCode : this.billerDetail.externalCode,
            //     buyPrice : this.billerDetail.buyPrice,
            //     fee : this.billerDetail.fee,
            //     profit : this.billerDetail.profit,
            //     sellPrice : this.billerDetail.sellPrice,
            //     billerHeaderId : this.billerDetail.billerHeaderId,
            //     billerProductId : this.billerDetail.billerProductId,
            //     postPaid : this.billerDetail.postPaid,
            //     status : this.billerDetail.status
            // };
            // this.dialogRef.close(varBack);
        } else {
            console.log('send to service ', this.billerDetail);
            this.billerDetailService.update(this.billerDetail.id, this.billerDetail).subscribe((res: HttpResponse<BillerDetail>) => {
                this.dialogRef.close(varBack);
            });
        }
    }

}
