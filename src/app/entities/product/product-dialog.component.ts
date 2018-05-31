import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';

// added
import { BillerCompany, BillerCompanyService } from '../biller-company';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-product-dialog',
    templateUrl: './product-dialog.component.html',
    styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {

    billTypeCtrl: FormControl;
    filteredBillType: Observable<any[]>;

    product: Product;
    billerTypeList = [];
    billerCompanyList = [];

    constructor(
        private billerCompanyService: BillerCompanyService,
        public dialogRef: MatDialogRef<ProductDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.billTypeCtrl = new FormControl();
        this.filteredBillType = this.billTypeCtrl.valueChanges
        .pipe(
            startWith(''),
            map(billerType => billerType ? this.filterBillType(billerType) : this.billerTypeList.slice())
        );
    }

    filterBillType(name: string) {
        return this.billerTypeList.filter(billerType =>
        billerType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    ngOnInit() {
        this.product = {};
        this.billerCompanyService.query({})
        .subscribe(
                (res: HttpResponse<BillerCompany[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
        // this.billerTypeList = BILLER_TYPE;
    }

    private onSuccess(data, headers) {
        console.log('success biller company..', data);
        // this.products = data.content;
        // this.gridApi.setRowData(this.products);
    }

    private onError(error) {
        console.log('error..');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

// billerCompany : {id: 1, name: "Telkomsel"}
// billerType : {id: 1, ispostpaid: false, name: "Pulsa Handphone"}
// denom : "5000"
// id : 1
// name : "Pulsa HP"
// productCode : "PLSTSEL5"
// searchBy : 1
// searchByMemberId : 10
// sellPrice : 8000
// status : "ACTIVE"

export interface BillerType {
    id: Number;
    name: string;
}

const BILLER_TYPE: BillerType[] = [
    {id: 1, name: 'Tipe 1'},
    {id: 2, name: 'Tipe 2'}
];
