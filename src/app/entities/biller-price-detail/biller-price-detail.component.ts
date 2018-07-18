import { Component, OnInit, Inject } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BillerPriceDetail } from './biller-price-detail.model';
import { BillerPriceDetailService } from './biller-price-detail.service';

import { BillerDetail } from '../biller-detail';
import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';
import { Product } from '../product';

import { BillerPriceInfoBillerComponent } from './biller-price-info-biller.component';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';

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
    dataListBill = [];
    statusList = [];
    billPayTypeList = [];
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    // minDate = new Date(2000, 0, 1);
    // maxDate = new Date(2020, 0, 1);
    mode = 'Add';
    disableDenom = false;

    tooltipCust = 'Info about the action&#13;Trial of tooltip';

    billerPDetForm: FormGroup;
    submitted = false;

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        public billerPriceDetailService: BillerPriceDetailService,
        public dialogRef: MatDialogRef<BillerPriceDetailComponent>,
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

        this.dateSCtrl = new FormControl();
        this.dateTCtrl = new FormControl();
    }

    ngOnInit() {
        this.billerPDetForm = this.formBuilder.group({
            billType: ['', [CommonValidatorDirective.required]],
            billComp: ['', CommonValidatorDirective.required],
            denom: ['', CommonValidatorDirective.required],
            sellPrice: ['', CommonValidatorDirective.required],
            profitMerc: ['', CommonValidatorDirective.required],
            profitDist: ['', CommonValidatorDirective.required],
            profitMemb: ['', CommonValidatorDirective.required],
            dateStart: ['', CommonValidatorDirective.required],
            dateThru: ['', CommonValidatorDirective.required],
            status: ['', CommonValidatorDirective.required]
        });
        this.billerPriceDetail = {};
        this.billerPriceDetail.billerHeaderId = this.data.rowData.billerHeaderId;
        this.disableDenom = false;
        console.log(this.data.mode);
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            console.log(this.data.rowData);
            this.mode = 'Edit';
            this.disableDenom = true;
            this.billerPriceDetail = {
                id: this.data.rowData.id,
                salesPrice: this.data.rowData.salesPrice,
                profit: this.data.rowData.profit,
                profitDistributorPks: this.data.rowData.profitDistributorPks,
                profitMemberPks: this.data.rowData.profitMemberPks,
                billerHeaderId: this.data.rowData.billerHeader.id,
                billerProductId: this.data.rowData.billerProduct.id,
                status: this.data.rowData.status
            };
            this.billTypeCtrl.setValue(this.data.rowData.billerProduct.billerType);
            this.billCompanyCtrl.setValue(this.data.rowData.billerProduct.billerCompany);
            this.dateSCtrl.setValue(this.data.rowData.dateStart);
            this.dateTCtrl.setValue(this.data.rowData.dateThru);

            this.billTypeCtrl.disable();
            this.billCompanyCtrl.disable();

            this.getListBiller(this.data.rowData.billerProduct.id);
        }
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
        this.productList = this.data.productData;
        this.statusList = this.data.statusData;
        this.billPayTypeList = this.data.billPayTypeData;
    }

    get form() { return this.billerPDetForm.controls; }

    getListBiller(idProduct: number) {
        this.billerPriceDetailService.getListBiller(idProduct)
        .subscribe(
            (res: HttpResponse<BillerDetail[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.dataListBill = data;
        if (this.dataListBill.length > 1) {
            for (let index = 0; index < this.dataListBill.length; index++) {
                this.dataListBill[index].no = index + 1;
            }
        }
    }

    private onError(error) {
        console.log('error..');
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

    showHelp(): void {
        console.log('help..');
        // this.snackBar.open(message, 'close', this.configSuccess);
        // this.snackBar.openFromComponent(BillerPriceInfoBillerComponent, {
        //     duration: 15000,
        // });
        this.dialog.open(BillerPriceInfoBillerComponent, {
            width: '1000px',
            data: this.dataListBill
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
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
                if (res.body.errMsg === null || res.body.errMsg === '') {
                    this.dialogRef.close('refresh');
                } else {
                    this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
            });
        } else {
            console.log('send to service ', this.billerPriceDetail);
            this.billerPriceDetailService.update(this.billerPriceDetail.id, this.billerPriceDetail)
            .subscribe((res: HttpResponse<BillerPriceDetail>) => {
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

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.billerPDetForm.invalid) {
            return;
        }
    }

}
