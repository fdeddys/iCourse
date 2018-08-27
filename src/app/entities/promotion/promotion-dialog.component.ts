import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Promotion } from './promotion.model';
import { PromotionService } from './promotion.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators , FormControl} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Member } from '../member';
import { Biller } from '../biller';
import { BillerType } from '../biller-type';
import { BillerCompany } from '../biller-company';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';

@Component({
    selector: 'app-promotion-dialog',
    templateUrl: './promotion-dialog.component.html',
    styleUrls: ['./promotion-dialog.component.css']
})
export class PromotionDialogComponent implements OnInit {
    promotion: Promotion;
    promotionSave: Promotion;
    dateSCtrl: FormControl;
    dateTCtrl: FormControl;
    memberCtrl: FormControl;
    filteredMember: Observable<any[]>;
    billTypeCtrl: FormControl;
    filteredBillType: Observable<any[]>;
    billCompanyCtrl: FormControl;
    filteredBillCompany: Observable<any[]>;
    billSubsCtrl: FormControl;
    filteredBillSubs: Observable<any[]>;

    modeTitle = '';
    memberList = [];
    billSubsList = [];
    billerTypeList = [];
    billerCompanyList = [];
    productList = [];
    promotionTypeList = [];
    categoryList = [];
    statusList = [];

    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    // statusData = true;
    promotionForm: FormGroup;
    valueVal = '0';
    budgetVal = '0';
    balanceVal = '0';
    maxPromoAmountVal = '0';
    minTransAmountVal = '0';
    mode = 'Add';
    submitted = false;

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        public promotionService: PromotionService,
        public dialogRef: MatDialogRef<PromotionDialogComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.setDefaultLang('en');
        translate.use('en');

        this.dateSCtrl = new FormControl();
        this.dateTCtrl = new FormControl();

        this.memberCtrl = new FormControl();
        this.filteredMember = this.memberCtrl.valueChanges
        .pipe(
            startWith<string | Member>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterMember(name) : this.memberList.slice())
        );

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

        this.billSubsCtrl = new FormControl();
        this.filteredBillSubs = this.billSubsCtrl.valueChanges
        .pipe(
            startWith<string | Biller>(''),
            map(value => typeof value === 'string' ? value : value.member.name),
            map(name => name ? this.filterBillSubs(name) : this.billSubsList.slice())
        );
    }

    ngOnInit() {
        this.promotionForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            dateStart: ['', [CommonValidatorDirective.required]],
            dateThru: ['', [CommonValidatorDirective.required]],
            // budget: ['', [CommonValidatorDirective.required]],
            // balance: ['', [CommonValidatorDirective.required]],
            maxPromoAmount: ['', [CommonValidatorDirective.required]],
            minTransAmount: ['', [CommonValidatorDirective.required]],
            applyTo: ['', [CommonValidatorDirective.required]],
            applyToTypeId: ['', [CommonValidatorDirective.required]],
            applyToCompanyId: ['', [CommonValidatorDirective.required]],
            applyToProductId: ['', [CommonValidatorDirective.required]],
            applyToMemberTypeId: ['', [CommonValidatorDirective.required]],
            onBehalfId: ['', [CommonValidatorDirective.required]],
            type: ['', [CommonValidatorDirective.required]],
            value: ['', [CommonValidatorDirective.required]],
            // status: ['', [CommonValidatorDirective.required]]
        });

        this.promotion = {};
        this.promotion.applyTo = 4;
        this.promotion.type = 1;
        this.promotion.value = 0;
        this.promotion.active = 'ACTIVE';
        this.promotion.applyToProductId = null;

        this.billTypeCtrl.setValue({id: null, ispostpaid: null, name: null});
        this.billCompanyCtrl.setValue({id: null, name: null});
        this.billTypeCtrl.disable();
        this.billCompanyCtrl.disable();

        if (this.data.mode !== 'create') {
            this.mode = 'Edit';
            this.promotion = this.data.rowData;
            console.log('this.promotion : ', this.promotion);

            this.valueVal = this.currencyFormatter(this.data.rowData.value);
            this.budgetVal = this.currencyFormatter(this.data.rowData.budget);
            this.balanceVal = this.currencyFormatter(this.data.rowData.balance);
            this.maxPromoAmountVal = this.currencyFormatter(this.data.rowData.maxPromoAmount);
            this.minTransAmountVal = this.currencyFormatter(this.data.rowData.minTransAmount);

            this.dateSCtrl.setValue(this.data.rowData.dateStart);
            this.dateTCtrl.setValue(this.data.rowData.dateThrough);
            this.billSubsCtrl.setValue(this.data.rowData.applyToMemberType);
            this.memberCtrl.setValue(this.data.rowData.onBehalfMember);
            this.billTypeCtrl.setValue(this.data.rowData.applyToType);
            this.billCompanyCtrl.setValue(this.data.rowData.applyToCompany);
            this.billTypeCtrl.enable();
            this.billCompanyCtrl.enable();
        }

        this.modeTitle = this.data.modeTitle;
        this.memberList = this.data.memberData;
        this.billSubsList = this.data.billSubsData;
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
        this.productList = this.data.productData;
        this.promotionTypeList = this.data.promotionTypeData;
        this.categoryList = this.data.categoryData;
        this.statusList = this.data.statusData;
    }

    get form() { return this.promotionForm.controls; }

    filterMember(name: string) {
        return this.memberList.filter(member =>
        member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterBillType(name: string) {
        return this.billerTypeList.filter(billerType =>
        billerType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterBillCompany(name: string) {
        return this.billerCompanyList.filter(billerCompany =>
        billerCompany.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterBillSubs(name: string) {
        return this.billSubsList.filter(billSubs =>
        billSubs.member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnMem(member?: Member): string | undefined {
        return member ? member.name : undefined;
    }

    displayFnBil(billerType?: BillerType): string | undefined {
        return billerType ? billerType.name : undefined;
    }

    displayFnCom(billerCompany?: BillerCompany): string | undefined {
        return billerCompany ? billerCompany.name : undefined;
    }

    displayFnBillSubs(biller?: Biller): string | undefined {
        return biller ? biller.member.name + ' (' + biller.memberCode + ')' : undefined;
    }

    currencyFormatter(val) {
        if (val !== null) {
            const temp = (parseFloat(val)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
            return temp.substring(0, (temp.length - 3));
        } else { return ''; }
    }

    currencyFormat(event, field) {
        // When user select text in the document, also abort.
        // When the arrow keys are pressed, abort.
        if (_.find([38, 40, 37, 39], function(o) { return o === event.keyCode; })) {
            return;
        }

        // event.target.value = event.target.value.replace(/[\D\s\._\-]+/g, '');
        let temp = event.target.value.replace(/[\D\s\._\-]+/g, '');
        temp = temp ? parseInt( temp, 10 ) : 0;

        if (field === 'value') {
            if (this.promotion.type === 1 || this.promotion.type === 3) {
                if (temp > 100) {
                    temp = 100;
                }
            }
        }
        this.promotion[field] = temp;
        event.target.value = (( temp === 0 ) ? '' : temp.toLocaleString( 'id-ID' ));
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type === 'start') {
            this.promotion.dateStart = this.dateFormatter(event);
        } else if (type === 'thru') {
            this.promotion.dateThrough = this.dateFormatter(event);
        }
    }

    typeChange() {
        this.promotion.value = 0;
        this.valueVal = '0';
    }

    applyToChange() {
        this.billTypeCtrl.setValue({id: null, ispostpaid: null, name: null});
        this.billCompanyCtrl.setValue({id: null, name: null});
        this.promotion.applyToProductId = null;

        if (this.promotion.applyTo !== 4) {
            this.billTypeCtrl.enable();
            this.billCompanyCtrl.enable();
        } else {
            this.billTypeCtrl.disable();
            this.billCompanyCtrl.disable();
        }
    }

    dateFormatter(params): string {
        const dt  = new Date(params.value);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.promotionForm.invalid) {
            return;
        }
    }

    onSubmit() {
        this.promotionSave = {
            id: this.promotion.id,
            name: this.promotion.name,
            type: this.promotion.type,
            value: this.promotion.value,
            budget: this.promotion.budget,
            balance: this.promotion.balance,
            maxPromoAmount: this.promotion.maxPromoAmount,
            minTransAmount: this.promotion.minTransAmount,
            applyTo: this.promotion.applyTo,
            applyToTypeId: (this.promotion.applyTo === 1 ? this.billTypeCtrl.value.id : null),
            applyToCompanyId: (this.promotion.applyTo === 2 ? this.billCompanyCtrl.value.id : null),
            applyToProductId: (this.promotion.applyTo === 3 ? this.promotion.applyToProductId : null),
            applyToMemberTypeId: this.billSubsCtrl.value.id,
            onBehalfMemberId: this.memberCtrl.value.id,
            active: this.promotion.active,
            // dateStart: this.dateFormatter(this.dateSCtrl),
            // dateThrough: this.dateFormatter(this.dateTCtrl),
            dateStart: this.dateSCtrl.value,
            dateThrough: this.dateTCtrl.value,
        };
        console.log(this.promotionSave);

        if (this.promotionSave.id === undefined || this.promotionSave.id === null) {
            this.promotionService.create(this.promotionSave).subscribe((res: HttpResponse<Promotion>) => {
                if (res.body.errMsg === null || res.body.errMsg === '') {
                    this.dialogRef.close('refresh');
                } else {
                    this.snackBar.open('Error! ' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
            });
        } else {
            this.promotionService.update(this.promotionSave.id, this.promotionSave).subscribe((res: HttpResponse<Promotion>) => {
                if (res.body.errMsg === null || res.body.errMsg === '') {
                    this.dialogRef.close('refresh');
                } else {
                    this.snackBar.open('Error! ' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
            });
        }
    }
}
