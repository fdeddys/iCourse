import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators , FormControl} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';
import { Member } from '../member';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';

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
    membCtrl: FormControl;
    filteredMemb: Observable<any[]>;

    product: Product;
    productSave: Product;
    billerTypeList = [];
    billerCompanyList = [];
    memberList = [];
    searchByList = [];
    statusList = [];

    modeTitle = '';
    productForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        public productService: ProductService,
        public dialogRef: MatDialogRef<ProductDialogComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.setDefaultLang('en');
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

        this.membCtrl = new FormControl();
        this.filteredMemb = this.membCtrl.valueChanges
        .pipe(
            startWith<string | Member>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterMemb(name) : this.memberList.slice())
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

    filterMemb(name: string) {
        return this.memberList.filter(member =>
        member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnBil(billerType?: BillerType): string | undefined {
        return billerType ? billerType.name : undefined;
    }

    displayFnCom(billerCompany?: BillerCompany): string | undefined {
        return billerCompany ? billerCompany.name : undefined;
    }

    displayFnMem(member?: Member): string | undefined {
        return member ? member.name : undefined;
    }

    searchByChg() {
        console.log(this.product.searchBy);
        // ---- change search by if manual set member selection disabled
        this.membCtrl.setValue('');
        if (this.product.searchBy === 'BY_BILLER') {
            this.membCtrl.enable();
        } else {
            this.membCtrl.disable();
        }
    }

    get form() { return this.productForm.controls; }
    ngOnInit() {
        this.productForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            productCode : ['', [CommonValidatorDirective.required]],
            billerType : ['', [CommonValidatorDirective.required]],
            billerCompany : ['', [CommonValidatorDirective.required]],
            denom : ['', [CommonValidatorDirective.required]],
            sellPrice : ['', [CommonValidatorDirective.required]],
            billerSelectionMtd : ['', [CommonValidatorDirective.required]],
        });

        this.product = {};
        this.modeTitle = this.data.modeTitle;

        this.membCtrl.disable();
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            this.billCompanyCtrl.setValue(this.data.rowData.billerCompany);
            this.billTypeCtrl.setValue(this.data.rowData.billerType);

            console.log('this.data.rowData : ', this.data.rowData);
            if (this.data.rowData.searchBy === 'BY_BILLER') {
                this.membCtrl.enable();
                const idMbr = this.data.rowData.searchByMemberId;
                this.membCtrl.setValue(_.find(this.data.memberData, function(o) { return o.id === idMbr; }));
            }
        }
        this.product = this.data.rowData;
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
        this.searchByList = this.data.searchByData;
        this.statusList = this.data.statusData;
        this.memberList = this.data.memberData;
    }

    private onError(error) {
        console.log('error..', error);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        this.productSave = {
            id: this.product.id,
            name: this.product.name,
            productCode: this.product.productCode,
            denom: this.product.denom,
            sellPrice: this.product.sellPrice,
            status: this.product.status,
            billerCompanyId: (this.billCompanyCtrl.value === null ? null : this.billCompanyCtrl.value.id),
            billerTypeId: (this.billTypeCtrl.value === null ? null : this.billTypeCtrl.value.id),
            searchBy: this.product.searchBy,
            searchByMemberId: (this.membCtrl.value === null ? null : this.membCtrl.value.id),
        };
        console.log(this.productSave);
        if (this.productSave.id === undefined || this.productSave.id === null) {
            console.log('send to service ', this.productSave);
            this.productService.create(this.productSave).subscribe((res: HttpResponse<Product>) => {
                if (res.body.errMsg === null || res.body.errMsg === '') {
                    this.dialogRef.close('refresh');
                } else {
                    this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
            });
        } else {
            console.log('send to service ', this.productSave);
            this.productService.update(this.productSave.id, this.productSave).subscribe((res: HttpResponse<Product>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.productForm.invalid) {
            return;
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
