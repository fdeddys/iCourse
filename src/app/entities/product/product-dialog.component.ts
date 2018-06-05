import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';
import { ProductService } from './product.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';

@Component({
    selector: 'app-product-dialog',
    templateUrl: './product-dialog.component.html',
    styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {

    billTypeCtrl: FormControl;
    filteredBillType: Observable<any[]>;
    billCompanyCtrl: FormControl;
    filteredBillCompany: Observable<any[]>;

    product: Product;
    productSave: Product;
    billerTypeList = [];
    billerCompanyList = [];

    modeTitle = '';

    constructor(
        public productService: ProductService,
        public dialogRef: MatDialogRef<ProductDialogComponent>,
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

    ngOnInit() {
        this.product = {};
        this.modeTitle = this.data.modeTitle;
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            this.billCompanyCtrl.setValue(this.data.rowData.billerCompany);
            this.billTypeCtrl.setValue(this.data.rowData.billerType);
        }
        this.product = this.data.rowData;
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
    }

    private onError(error) {
        console.log('error..', error);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {
        this.productSave = {
            id: this.product.id,
            name: this.product.name,
            denom: this.product.denom,
            sellPrice: this.product.sellPrice,
            billerCompanyId: this.billCompanyCtrl.value.id,
            billerTypeId: this.billTypeCtrl.value.id,
            searchBy: this.product.searchBy,
            searchByMemberId: this.product.searchByMemberId,
        };
        console.log(this.productSave);
        if (this.product.id === undefined || this.product.id === null) {
            console.log('send to service ', this.product);
            this.productService.create(this.product).subscribe((res: HttpResponse<Product>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.product);
            this.productService.update(this.product.id, this.product).subscribe((res: HttpResponse<Product>) => {
                this.dialogRef.close('refresh');
            });
        }
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
