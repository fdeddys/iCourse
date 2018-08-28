import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Promotion } from '../promotion/promotion.model';
import { PromotionTrans } from './promotion-trans.model';
import { PromotionTransService } from './promotion-trans.service';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators , FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';

@Component({
    selector: 'app-promotion-trans-dialog',
    templateUrl: './promotion-trans-dialog.component.html',
    styleUrls: ['./promotion-trans-dialog.component.css']
})
export class PromotionTransDialogComponent implements OnInit {
    promotionTrans: PromotionTrans;
    promotionTransSave: PromotionTrans;
    modeTitle = '';
    transTypeList = [];
    promotionList = [];

    transDateCtrl: FormControl;
    promotionCtrl: FormControl;
    filteredPromotion: Observable<any[]>;

    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    promotionTransForm: FormGroup;
    debitVal = '0';
    creditVal = '0';
    balanceVal = '0';
    mode = 'Add';
    submitted = false;

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        public promotionTransService: PromotionTransService,
        public dialogRef: MatDialogRef<PromotionTransDialogComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.setDefaultLang('en');
        translate.use('en');

        this.transDateCtrl = new FormControl();
        this.promotionCtrl = new FormControl();
        this.filteredPromotion = this.promotionCtrl.valueChanges
        .pipe(
            startWith<string | Promotion>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterPromotion(name) : this.promotionList.slice())
        );
    }

    ngOnInit() {
        this.promotionTransForm = this.formBuilder.group({
            transType: ['', [CommonValidatorDirective.required]],
            promotionId: ['', [CommonValidatorDirective.required]],
            transDate: ['', [CommonValidatorDirective.required]],
            rrn: ['', [CommonValidatorDirective.required]],
            credit: ['', [CommonValidatorDirective.required]],
            debit: ['', [CommonValidatorDirective.required]],
            balance: ['', [CommonValidatorDirective.required]]
        });

        this.promotionTrans = {};
        if (this.data.mode !== 'create') {
            this.mode = 'Edit';
            this.promotionTrans = this.data.rowData;

            this.debitVal = this.currencyFormatter(this.data.rowData.debit);
            this.creditVal = this.currencyFormatter(this.data.rowData.credit);
            this.balanceVal = this.currencyFormatter(this.data.rowData.balance);
        }
        this.modeTitle = this.data.modeTitle;
        this.transTypeList = this.data.transTypeData;
        if (this.transTypeList.length === 1) {
            this.promotionTrans.transType = this.transTypeList[0].id;
        }
        this.promotionList = this.data.promotionData;
    }

    get form() { return this.promotionTransForm.controls; }

    filterPromotion(name: string) {
        return this.promotionList.filter(promotion =>
        promotion.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnProm(promotion?: Promotion): string | undefined {
        return promotion ? promotion.name : undefined;
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

        this.promotionTrans[field] = temp;
        event.target.value = (( temp === 0 ) ? '' : temp.toLocaleString( 'id-ID' ));
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.promotionTransForm.invalid) {
            return;
        }
    }

    onSubmit() {
        this.promotionTransSave = {
            id: this.promotionTrans.id,
            transType: this.promotionTrans.transType,
            promotionId: this.promotionCtrl.value.id,
            debit: this.promotionTrans.debit,
            credit: this.promotionTrans.credit,
            balance: this.promotionTrans.balance,
            rrn: this.promotionTrans.rrn,
            transDate: this.transDateCtrl.value,
        };
        console.log(this.promotionTransSave);

        // if (this.promotionTransSave.id === undefined || this.promotionTransSave.id === null) {
        //     this.promotionTransService.create(this.promotionTransSave).subscribe((res: HttpResponse<Promotion>) => {
        //         if (res.body.errMsg === null || res.body.errMsg === '') {
        //             this.dialogRef.close('refresh');
        //         } else {
        //             this.snackBar.open('Error! ' + res.body.errMsg , 'Close', {
        //                 duration: this.duration,
        //             });
        //         }
        //     });
        // } else {
        //     this.promotionTransService.update(this.promotionTransSave.id, this.promotionTransSave)
        //     .subscribe((res: HttpResponse<Promotion>) => {
        //         if (res.body.errMsg === null || res.body.errMsg === '') {
        //             this.dialogRef.close('refresh');
        //         } else {
        //             this.snackBar.open('Error! ' + res.body.errMsg , 'Close', {
        //                 duration: this.duration,
        //             });
        //         }
        //     });
        // }
    }
}
