import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BillerDetail } from './biller-detail.model';
import { BillerDetailService } from './biller-detail.service';
import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';
import { Product } from '../product';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';

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
    statusList = [];
    billPayTypeList = [];
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    // statusData = true;
    mode = 'Add';

    billerDetForm: FormGroup;
    extCodeDisabled = false;
    buyPriceDisabled = false;
    submitted = false;

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        public billerDetailService: BillerDetailService,
        public dialogRef: MatDialogRef<BillerDetailComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.use('en');

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
        this.billerDetForm = this.formBuilder.group({
            billType: ['', [CommonValidatorDirective.required]],
            billComp: ['', CommonValidatorDirective.required],
            denom: ['', CommonValidatorDirective.required],
            buyPrice: ['', CommonValidatorDirective.required],
            fee: ['', CommonValidatorDirective.required],
            profit: ['', CommonValidatorDirective.required],
            status: ['', CommonValidatorDirective.required],
            externalCode: ['', CommonValidatorDirective.required]
        });
        this.billerDetail = {};
        this.billerDetail.billerHeaderId = this.data.rowData.billerHeaderId;
        if (this.data.mode !== 'create') {
            console.log(this.data.rowData);
            this.mode = 'Edit';

            console.log( this.data.rowData);
            this.billerDetail = {
                id : this.data.rowData.id,
                externalCode : this.data.rowData.externalCode,
                buyPrice : (this.data.rowData.billPayType === 'POSTPAID' ? 0 : this.data.rowData.buyPrice),
                fee : this.data.rowData.fee,
                profit : this.data.rowData.profit,
                sellPrice : this.data.rowData.sellPrice,
                billerHeaderId : this.data.rowData.billerHeader.id,
                billerProductId : this.data.rowData.billerProduct.id,
               // billPayType : this.data.rowData.billPayType,
                status : this.data.rowData.status
            };
            // this.statusData = (this.data.rowData.status === 'ACTIVE' ? true : false);

            this.billTypeCtrl.setValue(this.data.rowData.billerProduct.billerType);
            this.billCompanyCtrl.setValue(this.data.rowData.billerProduct.billerCompany);
            this.extCodeDisabled = true;
            this.buyPriceDisabled = (this.data.rowData.billPayType === 'POSTPAID' ? true : false);
        }
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
        this.productList = this.data.productData;
        this.statusList = this.data.statusData;
        this.billPayTypeList = this.data.billPayTypeData;
    }

    get form() { return this.billerDetForm.controls; }

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

    onSubmit(): void {
        console.log(this.billerDetail);
        // this.billerDetail.status = (this.statusData ? 'ACTIVE' : 'INACTIVE');
        this.billerDetail.sellPrice = this.billerDetail.buyPrice + this.billerDetail.fee;
        // this.billerDetail.externalCode = '';
       // this.billerDetail.postPaid = 1;
        const varBack = {
            mode: this.data.mode,
            rowData: {}
        };

        if (this.billerDetail.id === undefined || this.billerDetail.id === null) {
            console.log('send to service ', this.billerDetail);
            // direct save
            this.billerDetailService.create(this.billerDetail).subscribe((res: HttpResponse<BillerDetail>) => {
                if (res.body.errMsg === null || res.body.errMsg === '') {
                    this.dialogRef.close('refresh');
                } else {
                    this.snackBar.open('Error ! ' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
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
                if (res.body.errMsg === null || res.body.errMsg === '') {
                    this.dialogRef.close('refresh');
                } else {
                    this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
            });
        }
    }

    valCheck(el): void {
        if (el === 'profit') {
            if (this.billerDetail.profit > this.billerDetail.fee) {
                // this.billerDetail.profit = this.billerDetail.fee;
            }
        }
        if (this.billerDetail[el] < 0) {
            this.billerDetail[el] = 0;
        }
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.billerDetForm.invalid) {
            return;
        }
    }

}
